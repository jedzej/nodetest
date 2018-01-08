const lobbyService = require('../lobby/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
var debug = require('debug')('chat:handlers');
debug.log = console.log.bind(console);

const handlers = {

  'CHAT_MESSAGE': (action, ws, db) => {
    var context = new tools.Context();
    return tools.verify(ws.store.currentUser, new SapiError("Not logged in", "EAUTH"))()
      .then(() => lobbyService.getFor(db, ws.store.currentUser))
      .then(lobby => tools.verify(lobby, new SapiError("Not in lobby", "ELOBBY"))(lobby))
      .then(lobby => {
        const wsClientsToUpdate = sapi.getClients(tools.filterLobbyMembers(lobby));
        debug("Notifying %d clients", wsClientsToUpdate.length);
        for (var wsClient of wsClientsToUpdate) {
          debug("Notifying %s", wsClient.store);
          wsClient.sendAction({
            type: "CHAT_UPDATE",
            payload: {
              from: {
                id: ws.store.currentUser._id,
                name: ws.store.currentUser.name
              },
              message: action.payload.message,
              timestamp: Date.now()
            }
          });
        }
      })
      .catch(err => {
        ws.sendAction({
          type: "CHAT_MESSAGE_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      });
  }
}

module.exports = handlers;
