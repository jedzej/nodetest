const tools = require('../tools');
const ObjectId = require('mongodb').ObjectId;
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

const get = {
  byQuery: (db, query) => db.collection('user').findOne(query)
    .then(user => user ? Promise.resolve(user) : Promise.reject("User not found")),

  byId: (db, id) => get.byQuery(db, { _id: id }),

  byToken: (db, token) => get.byQuery(db, { token: token }),

  manyByIds: (db, ids) => db.collection('user').find({
    "_id": {
      "$in": ids.map((id) => typeof id == "string" ? new ObjectId(id) : id)
    }
  }).toArray()
};


const register = (db, name, password) => {
  const user = {
    name: name,
    password: password,
    token: null
  };
  if (name == null || password == null) {
    return Promise.reject("Validation failure");
  } else {
    return db.collection('user')
      .insertOne(user)
      .then(result => {
        return Promise.resolve(result.ops[0])
      });
  }
}


const login = (db, name, password) => {
  return Promise.all([
    get.byQuery(db, { name: name, password: password }),
    tools.genUniqueToken()
  ])
    .then(([user, token]) => {
      if (user === null)
        return Promise.reject("Authentication error");
      else
        return db.collection('user').updateOne(
          { name: user.name },
          { $set: { token: token } },
          { upsert: true }
        )
          .then(() => get.byToken(db, token));
    });
}


const loginByToken = (db, token) => {
  return get.byToken(db, token)
    .then(user => user ? Promise.resolve(user) : Promise.reject("Authentication error"))
}


const logout = (db, token) => {
  if (!token)
    return Promise.reject("Invalid token");
  else
    return get.byToken(db, token)
      .then(user => db.collection('user').updateOne(
        { name: user.name },
        { $set: { token: null } },
        { upsert: true }
      ))
}


module.exports = {
  get,
  register,
  login,
  loginByToken,
  logout,
  dbReset
};
