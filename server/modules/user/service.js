var EventEmitter = require('events');
var crypto = require('crypto');
const tools = require('../tools');
const MongoClient = require('mongodb').MongoClient;


const dbReset = (db) => {
  return db.dropCollection('user')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('user'))
    .then(() => db.collection('user').createIndex(
      { name: 1 },
      { unique: true }
    ));
}


function getBy(db, query) {
  return db.collection('user').findOne(query);
}


const register = (db, name, password) => {
  var user = {
    name: name,
    password: password,
    token: null
  }
  return db.collection('user')
    .insertOne(user)
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
