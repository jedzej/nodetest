const verify = require('./tools').verify;
const sapi = require('../sapi');

const error = (msg, code) => new sapi.SapiError(msg, code);

module.exports = {
  ws: {
    byId: id => ws => ws.store.currentUser && ws.store.currentUser._id.equals(id),
    byLobbyId: lobbyId => ws => ws.store.lobbyId ? ws.store.lobbyId.equals(lobbyId) : false,
    concurrentById: (id, wsPrimary) => ws =>
      wsPrimary != ws &&
      ws.store.currentUser &&
      ws.store.currentUser._id.equals(id)
  }
}