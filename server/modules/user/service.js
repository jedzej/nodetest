var EventEmitter = require('events');
var crypto = require('crypto');
const tools = require('../tools');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const SapiError = require('../../sapi').SapiError;

var debug = require('debug')('user:service');
debug.log = console.log.bind(console);


const dbReset = (db) => {
  return db.dropCollection('user')
    .catch((err) => { debug(err) })
    .then(() => db.createCollection('user'))
    .then(() => db.collection('user').createIndex(
      { name: 1 },
      { unique: true }
    ));
}


function getBy(db, query) {
  return db.collection('user').findOne(query);
}

function getByIds(db, ids) {
  return Promise.resolve()

    .then(() => db.collection('user').find({
      "_id": {
        "$in": ids.map((id) => 
          typeof id == "string" ? new ObjectId(id) : id
        )
      }
    }))
    .then(cursor => cursor.toArray())
}


const register = (db, name, password) => {
  const user = {
    name: name,
    password: password,
    token: null
  };
  if (name == null || password == null) {
    return Promise.reject(new SapiError("Validation failure", "EINVALIDVALUE"));
  } else {
    return db.collection('user')
      .insertOne(user)
      .then(result => {
        return Promise.resolve(result.ops[0])
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
}


const login = (db, name, password) => {
  return Promise.all([
    getBy(db, { name: name, password: password }),
    tools.genUniqueToken()
  ])
    .then(user_token => {
      var [user, token] = user_token;
      if (user === null)
        return Promise.reject(new SapiError("Authentication error", "EAUTH"));
      else
        return db.collection('user').updateOne(
          { name: user.name },
          { $set: { token: token } },
          { upsert: true }
        )
          .then(() => getBy(db, { token: token }));
    });
}

const loginByToken = (db, token) => {
  return getBy(db, { token: token })
    .then((user) => {
      Promise.resolve(user);
    });
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
  'dbReset': dbReset,
  'getByIds': getByIds
};
