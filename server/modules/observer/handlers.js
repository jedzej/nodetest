var lobbyService = require('../lobby/service');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
var debug = require('debug')('observer:handlers');
debug.log = console.log.bind(console);


const handlers = {

  'OBSERVER_JOIN': (action, ws, db) => {
    var context = new tools.Context();
    return lobbyService.getBy(db, {token:action.payload.token})
      .then(context.store('lobby'))
      .then(lobby=>{
        console.log(lobby)
        return lobby;
      })
      .then(tools.verify(context.lobby !== null, new SapiError('Lobby does not exist', 'ENOLOBBY')))
      .then(lobby => {
        debug('Joining lobby ',lobby._id);
        ws.store.isObserver = true;
        ws.store.lobbyId = lobby._id;
        ws.sendAction({
          type: "OBSERVER_JOIN_FULFILLED"
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "OBSERVER_JOIN_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      });
  },

}

module.exports = handlers;
