const assert = require('assert');
const userService = require('../user/service');
const userHandlers = require('../user/handlers');
const lobbyService = require('./service');
const lobbyHandlers = require('./handlers');

const dbconfig = require('../../dbconfig');
const sapi = require('../../sapi');
const sendAction = sapi.test.sendAction;
const waitForAction = sapi.test.waitForAction;


describe('Lobby', function () {

  before(() => {
    dbconfig.setEnv({ dbName: 'ggPlatformDev' });
    return dbconfig.connect().then((client) => {
      return sapi.start(3069, sapi.combineHandlers(lobbyHandlers, userHandlers), dbconfig.db(client));
    })
  });


  it('should create', function () {
    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", ws =>
        userService.dbReset(db)

          /* USER REGISTER */
          .then(sendAction(ws, {
            type: "USER_REGISTER",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_REGISTER_FULFILLED"))

          /* USER LOGIN */
          .then(sendAction(ws, {
            type: "USER_LOGIN",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_LOGIN_FULFILLED"))
          .then(waitForAction(ws, "USER_UPDATE"))
          .then(action => {
            const user = action.payload;

            /* LOBBY CREATE */
            return sendAction(ws, { type: "LOBBY_CREATE" })()
              .then(waitForAction(ws, "LOBBY_CREATE_FULFILLED"))
              .then(waitForAction(ws, "LOBBY_UPDATE"))
              .then((action) => {
                const lobby = action.payload;
                assert.ok(lobby.leaderId == user.id);
              })
          })
      ));
  });

  it('should join and leave', function () {
    var context = {};

    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", wsl =>
        sapi.withWS("ws://localhost:3069", wsj => {
          return userService.dbReset(db)
            .then(() => lobbyService.dbReset(db))

            /* USERS REGISTER */
            .then(sendAction(wsl, { type: "USER_REGISTER", payload: { name: 'uleader', password: 'upass' } }))
            .then(waitForAction(wsl, "USER_REGISTER_FULFILLED"))
            .then(sendAction(wsj, { type: "USER_REGISTER", payload: { name: 'ujoiner', password: 'upass' } }))
            .then(waitForAction(wsj, "USER_REGISTER_FULFILLED"))

            /* USERS LOGIN */
            .then(sendAction(wsl, { type: "USER_LOGIN", payload: { name: 'uleader', password: 'upass' } }))
            .then(waitForAction(wsl, "USER_LOGIN_FULFILLED"))
            .then(sendAction(wsj, { type: "USER_LOGIN", payload: { name: 'ujoiner', password: 'upass' } }))
            .then(waitForAction(wsj, "USER_LOGIN_FULFILLED"))

            .then(() => Promise.all([
              waitForAction(wsl, "USER_UPDATE")(),
              waitForAction(wsj, "USER_UPDATE")()
            ]))
            .then(leader_joiner => {
              [context.leader, context.joiner] = leader_joiner.map((e) => e.payload);
            })

            /* LOBBY CREATE */
            .then(sendAction(wsl, { type: "LOBBY_CREATE" }))
            .then(waitForAction(wsl, "LOBBY_CREATE_FULFILLED"))
            .then(waitForAction(wsl, "LOBBY_UPDATE"))
            .then(action => {
              context.leaderLobby = action.payload;
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
              context.joinerLobby = action.payload;
              assert.equal(context.joinerLobby.token, context.leaderLobby.token);
              assert.equal(context.joinerLobby.leaderId, context.leaderLobby.leaderId);
            })
            .then(waitForAction(wsl, "LOBBY_UPDATE"))
            .then(action => {
              context.leaderLobby = action.payload;
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
              context.leaderLobby = action.payload;
              assert.equal(context.leaderLobby.token, null);
              assert.equal(context.leaderLobby.leaderId, null);
              assert.equal(context.leaderLobby.members, null);
            })
            .then(waitForAction(wsj, "LOBBY_UPDATE"))
            .then(action => {
              context.joinerLobby = action.payload;
              assert.equal(context.joiner.id, context.joinerLobby.leaderId);
              assert.equal(context.joinerLobby.members.length, 1);
            })

            /* JOINER LEAVES */
            .then(sendAction(wsj, { type: "LOBBY_LEAVE" }))
            .then(waitForAction(wsj, "LOBBY_LEAVE_FULFILLED"))
            .then(waitForAction(wsj, "LOBBY_UPDATE"))
            .then(action => {
              context.joinerLobby = action.payload;
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



  after(() => {
    sapi.stop();
  })
});
