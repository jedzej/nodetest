const lobbyService = require('../lobby/service');
const userService = require('../user/service');
const appService = require('../app/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
const check = require('../check');
const filter = require('../filter');
const app2sapi = require('../../app2sapi');
const rejectionAction = tools.rejectionAction;
var debug = require('debug')('lobby:handlers');
debug.log = console.log.bind(console);


const handlers = {

  'APP_UPDATE_REQUEST': (action, ws, db) => {
    return app2sapi.doAppUpdate(db, ws.store.lobbyId, ws)
      .catch(err => {
        ws.sendAction(rejectionAction("APP_UPDATE_REJECTED", err));
        throw err;
      });
  },

  'APP_START': (action, ws, db) => {
    var ctx = new tools.Context();
    return Promise.resolve()
      .then(check.loggedIn(ws))
      .then(check.inLobby(ws))
      .then(() => lobbyService.get.byId(db, ws.store.lobbyId))
      .then(ctx.store('lobby'))
      .then(data => check.isLeader(ws, ctx.lobby)(data))
      .then(() => sapi.inject({
        type: 'APP_START_HOOK',
        payload: action.payload
      }, ws, db))
      .then(() => {
        ws.sendAction("APP_START_FULFILLED");
        return app2sapi.doAppUpdate(db, ctx.lobby._id);
      })
      .catch(err => {
        ws.sendAction(
          rejectionAction("APP_START_REJECTED", err))
        throw err;
      });
  },

  'APP_TERMINATE': (action, ws, db) => {
    var ctx = new tools.Context();
    return Promise.resolve()
      .then(check.loggedIn(ws))
      .then(check.inLobby(ws))
      .then(() => lobbyService.get.byId(db, ws.store.lobbyId))
      .then(ctx.store('lobby'))
      .then(data => check.isLeader(ws, ctx.lobby)(data))
      .then(() => sapi.inject({
        type: "APP_TERMINATE_HOOK",
        payload: { name: action.payload.name }
      }, ws, db))
      .then((results) => {
        console.log(results)
        return appService
          .destroyAppdata(db, ws.store.lobbyId, action.payload.name)
      })
      .then(() => {
        ws.sendAction("APP_TERMINATE_FULFILLED");
        return app2sapi.doAppUpdate(db, ctx.lobby._id);
      })
      .catch(err => {
        ws.sendAction(
          rejectionAction("APP_TERMINATE_REJECTED", err)
        );
        throw err;
      });
  }
}

module.exports = handlers;
