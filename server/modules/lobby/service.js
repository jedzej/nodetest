var EventEmitter = require('events');
var crypto = require('crypto');
const tools = require('../tools');
const MongoClient = require('mongodb').MongoClient;


const dbReset = (db) => {
  return db.dropCollection('lobby')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('lobby'))
    .then(() => db.collection('lobby').createIndex(
      { name: 1 },
      { unique: true }
    ));
}


function getBy(db, query) {
  return db.collection('lobby').findOne(query);
}


const create = (db, leaderId) => {
  var lobby = {
    leaderId: leaderId,
    members = [leaderId]
  }
  return db.collection('lobby')
    .insertOne(lobby)
    .then(result => (Promise.resolve(result.ops[0])));
}


const login = (db, name, password) => {
  return Promise.all([
    getBy(db, { name: name, password: password }),
    tools.genUniqueToken()
  ])
    .then(user_token => {
      var [user, token] = user_token;
      return db.collection('user').updateOne(
        { name: user.name },
        { $set: { token: token } },
        { upsert: true }
      ).then(() => Promise.resolve(token));
    });
}

const loginByToken = (db, token) => {
  return getBy(db, { token: token }).then(() => Promise.resolve(token));
}


const logout = (db, token) => {
  if (!token)
    return Promise.reject(new TypeError("Invalid token"));
  else
    return getBy(db, { token: token })
      .then(user => {
        return db.collection('user').updateOne(
          { name: user.name },
          { $set: { token: null } },
          { upsert: true }
        );
      });
}


module.exports = {
  'getBy': getBy,
  'register': register,
  'login': login,
  'loginByToken': loginByToken,
  'logout': logout,
  'dbReset': dbReset
};









var EventEmitter = require('events')
const auth = require('./auth')
const tools = require('./tools')

var lobbies = new Map();

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

function create(db, leaderId) {
  db.
  if (getLobbyFor(leaderId)) {
    var err = new Error('Already in a lobby!');
    err.code = "ELOBBYSTATE";
    callback(err);
  } else {
    tools.genUniqueToken(function (err, token) {
      if (err) {
        err.code = "ETOKENERROR";
        callback(err);
      } else {
        const id = "lobby_" + token;
        lobbies.set(id, new Lobby(leaderId, id));
        callback(null, lobbies.get(id));
      }
    });
  }
}


module.exports = {
  'get': get,
  'create': create,
  'getLobbyFor': getLobbyFor
};
