const verify = require('./tools').verify;
const sapi = require('../sapi');

const error = (msg, code) => new sapi.SapiError(msg, code);

module.exports = {
  ifTrue: (cond, errorMessage, errorCode) => verify(cond, error(errorMessage, errorCode)),
  loggedIn: ws => verify(ws.store.currentUser, error("Not logged in", "EAUTH")),
  notLoggedIn: ws => verify(!ws.store.currentUser, error("Already logged in", "EAUTH")),
  inLobby: ws => verify(ws.store.currentUser, error("Not in lobby", "EAUTH")),
  notInLobby: ws => verify(ws.store.currentUser, error("Already in lobby", "EAUTH")),
  isLeader: (ws, lobby) => verify(ws.store.currentUser._id.equals(lobby.leaderId), error("Not a leader", "EAUTH"))
}