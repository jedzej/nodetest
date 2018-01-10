const assert = require('assert');
const userService = require('../user/service');
const userHandlers = require('../user/handlers');
const lobbyService = require('./service');
const lobbyHandlers = require('./handlers');

const dbconfig = require('../../dbconfig');
const sapi = require('../../sapi');
const PARTIALS = require('../testpartials');
const Context = require('../tools').Context
const sendAction = sapi.test.sendAction;
const waitForAction = sapi.test.waitForAction;


describe('Lobby', function () {

  before(() => {
    dbconfig.setEnv({ dbName: 'ggPlatformDev' });
    return dbconfig.connect().then((client) => {
      return sapi.start(3069, sapi.combineHandlers(lobbyHandlers, userHandlers), dbconfig.db(client));
    })
  });


  it('should create and get', function () {
    var context = new Context();
    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", ws =>
        userService.dbReset(db)

          /* USER CREATE */
          .then(PARTIALS.userCreate(ws, 'uname', 'upass'))
          .then(context.store('user'))

          /* LOBBY CREATE */
          .then(PARTIALS.lobbyCreate(ws))
          .then(context.store('lobby'))

          .then(() => {
            assert.equal(context.lobby.leaderId, context.user.id);
          })

          /* REQUEST UPDATE */
          .then(sendAction(ws, { type: "LOBBY_UPDATE_REQUEST" }))
          .then(waitForAction(ws, "LOBBY_UPDATE"))
          .then(action => {
            assert.deepEqual(context.lobby, action.payload);
          })
      ));
  });

  it('should join and leave', function () {
    var context = new Context();

    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", wsl =>
        sapi.withWS("ws://localhost:3069", wsj => {
          return userService.dbReset(db)
            .then(() => lobbyService.dbReset(db))

            /* USERS CREATE */
            .then(PARTIALS.userCreate(wsl, 'uleader', 'upass'))
            .then(context.store('leader'))
            .then(PARTIALS.userCreate(wsj, 'ujoiner', 'upass'))
            .then(context.store('joiner'))

            /* LOBBY CREATE */
            .then(PARTIALS.lobbyCreate(wsl))
            .then(context.store('leaderLobby'))
            .then(() => {
              assert.equal(context.leader.id, context.leaderLobby.leaderId);
            })

            /* LOBBY JOIN */
            .then(sendAction(wsj, () => ({
              type: "LOBBY_JOIN",
              payload: {
                token: context.leaderLobby.token
              }
            })))
            .then(waitForAction(wsj, "LOBBY_JOIN_FULFILLED"))
            .then(waitForAction(wsj, "LOBBY_UPDATE"))
            .then(action => {
              context.store('joinerLobby')(action.payload);
              assert.equal(context.joinerLobby.token, context.leaderLobby.token);
              assert.equal(context.joinerLobby.leaderId, context.leaderLobby.leaderId);
            })
            .then(waitForAction(wsl, "LOBBY_UPDATE"))
            .then(action => {
              context.store('leaderLobby')(action.payload);
              assert.deepEqual(context.joinerLobby, context.leaderLobby);
            })

            /* DOUBLE CREATE */
            .then(sendAction(wsl, { type: "LOBBY_CREATE" }))
            .then(waitForAction(wsl, "LOBBY_CREATE_REJECTED"))
            .then(sendAction(wsj, { type: "LOBBY_CREATE" }))
            .then(waitForAction(wsj, "LOBBY_CREATE_REJECTED"))

            /* LEADER LEAVES */
            .then(sendAction(wsl, { type: "LOBBY_LEAVE" }))
            .then(waitForAction(wsl, "LOBBY_LEAVE_FULFILLED"))
            .then(waitForAction(wsl, "LOBBY_UPDATE"))
            .then(action => {
              context.store('leaderLobby')(action.payload);
              assert.equal(context.leaderLobby.token, null);
              assert.equal(context.leaderLobby.leaderId, null);
              assert.equal(context.leaderLobby.members, null);
            })
            .then(waitForAction(wsj, "LOBBY_UPDATE"))
            .then(action => {
              context.store('joinerLobby')(action.payload);
              assert.equal(context.joinerLobby.members.length, 1);
              assert.equal(context.joiner.id, context.joinerLobby.leaderId);
            })

            /* JOINER LEAVES */
            .then(sendAction(wsj, { type: "LOBBY_LEAVE" }))
            .then(waitForAction(wsj, "LOBBY_LEAVE_FULFILLED"))
            .then(waitForAction(wsj, "LOBBY_UPDATE"))
            .then(action => {
              context.store('joinerLobby')(action.payload);
              assert.equal(context.leaderLobby.token, null);
              assert.equal(context.leaderLobby.leaderId, null);
              assert.equal(context.leaderLobby.members, null);
            })
            .then(() => lobbyService.getBy(db, {}))
            .then(lobby => {
              assert.equal(lobby, null);
            })
            .catch(err => { throw err; })
        })
      )
    )
  })


  it('should list', function () {
    this.timeout(5000);
    var context = {};

    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", ws1 =>
        sapi.withWS("ws://localhost:3069", ws2 => {
          return userService.dbReset(db)
            .then(() => lobbyService.dbReset(db))

            /* USERS REGISTER */
            .then(PARTIALS.userCreate(ws1, 'uname1', 'upass'))
            .then(user => { context.user1 = user; })
            .then(PARTIALS.userCreate(ws2, 'uname2', 'upass'))
            .then(user => { context.user2 = user; })

            /* LOBBIES CREATE */
            .then(PARTIALS.lobbyCreate(ws1))
            .then(lobby => { context.lobby0 = lobby; })
            .then(PARTIALS.lobbyCreate(ws2))
            .then(lobby => { context.lobby1 = lobby; })

            /* LOBBY LIST */
            .then(sendAction(ws1, { type: "LOBBY_LIST" }))
            .then(waitForAction(ws1, "LOBBY_LIST_FULFILLED"))
            .then(action => {
              const lobbies = action.payload;
              assert.deepEqual(context.lobby0, lobbies[0]);
              assert.deepEqual(context.lobby1, lobbies[1]);
              console.log(action)
            })
        })
      )
    )
  })



  after(() => {
    sapi.stop();
  })
});
