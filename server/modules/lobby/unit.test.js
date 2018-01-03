const assert = require('assert');
const userService = require('../user/service');
const userHandlers = require('../user/handlers');
const lobbyService = require('./service');
const lobbyHandlers = require('./handlers');

const dbconfig = require('../../dbconfig');
const sapi = require('../../sapi');
const sendAction = require('../tools').sendAction;
const waitForAction = require('../tools').waitForAction;


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
                console.log(action)
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
              [context.leader, context.joiner] = leader_joiner;
            })

            /* LOBBY CREATE */
            .then(sendAction(wsl, { type: "LOBBY_CREATE" }))
            .then(waitForAction(wsl, "LOBBY_CREATE_FULFILLED"))
            .then(waitForAction(wsl, "LOBBY_UPDATE"))
            .then(action => {
              context.lobbyLeader = action.payload;
            })

            /* LOBBY JOIN */
            .then(sendAction(wsj, () => ({
              type: "LOBBY_JOIN",
              payload: {
                token: context.lobbyLeader.token
              }
            })))
            .then(waitForAction(wsj, "LOBBY_JOIN_FULFILLED"))
            .then(waitForAction(wsj, "LOBBY_UPDATE"))
            .then(action => {
              context.lobbyJoiner = action.payload;
              assert.equal(context.lobbyJoiner.token, context.lobbyLeader.token);
              assert.equal(context.lobbyJoiner.leaderId, context.lobbyLeader.leaderId);
            })
            .then(waitForAction(wsl, "LOBBY_UPDATE"))
            .then(action => {
              context.lobbyLeader = action.payload;
              assert.deepEqual(context.lobbyJoiner, context.lobbyLeader);
            })

            /* LOBBY LEAVE */

        })
      )
    )
  })



  after(() => {
    sapi.stop();
  })
});
