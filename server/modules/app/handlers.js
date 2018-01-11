const lobbyService = require('../lobby/service');
const userService = require('../user/service');
const appService = require('../app/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
var debug = require('debug')('lobby:handlers');
debug.log = console.log.bind(console);


const handlers = {

  'APP_UPDATE_REQUEST': (action, ws, db) => {
    return appService.getList(db, ws.store.lobbyId)
      .then(apps => {
        ws.sendAction({
          type: "APP_UPDATE",
          payload: apps
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "APP_UPDATE_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      });
  }
}

module.exports = handlers;
