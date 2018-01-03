var EventEmitter = require('events')
const auth = require('./auth')
const tools = require('./tools')

var lobbies = new Map();

function lobbyErr(code, message) {
  var err = new Error(message);
  err.code = code;
  return err;
}

class Lobby extends EventEmitter {

  constructor(leaderId, id) {
    super();
    this.id = id;
    this.members = [leaderId];
  }

  _emitAndLog() {
    this.emit.apply(this, arguments);
  }

  hasMember(userId) {
    return this.members.some((m) => m == userId);
  }

  join(userId, callback) {
    if (this.hasMember(userId)) {
      callback(lobbyErr("ELOBBYSTATE", userId + " is already a member!"));
    } else {
      this.members.push(userId);
      this._emitAndLog('join', userId);
      callback(null);
    }
  }

  leave(userId, callback) {
    if (this.hasMember(userId) == false) {
      callback(lobbyErr("ELOBBYSTATE", userId + " is not a member!"));
    } else {
      this.members = this.members.filter((e) => e != userId);
      this._emitAndLog('leave', userId);
      callback(null);
    }
  }

  destroy(callback) {
    if (lobbies.has(this.id) == false)
      throw lobbyErr("ELOBBYSTATE", "Already destroyed!");
    lobbies.delete(this.id);
    delete this.id
    this._emitAndLog('destroy');
  }

  forMembers(callback) {
    for (var userId of this.members) {
      auth.byUserId(userId, function (err, user) {
        callback(user);
      })
    }
  }
}

function get(id) {
  return lobbies.get(id);
}

function getLobbyFor(userId) {
  for (var [id, lobbyInstance] of lobbies) {
    if (lobbyInstance.hasMember(userId)) {
      return lobbyInstance;
    }
  }
  return undefined;
}



module.exports = {
  'get': get,
  'create': create,
  'getLobbyFor': getLobbyFor
};
