const tools = require('../tools');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const ObjectId = require('mongodb').ObjectId;

const dbReset = (db) => {
  return db.dropCollection('appdata')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('appdata'))
    .then(() => db.collection('appdata').createIndex(
      { _lobbyId: 1, _exclusive: 1 },
      { unique: true }
    ));
}


const getList = (db, lobbyId) => {
  return Promise.resolve(db.collection('appdata').find({ _lobbyId: lobbyId }))
    .then(cursor => cursor.toArray());
}

const getMap = (db, lobbyId) => getList(db, lobbyId)
  .then(appdataList => appdataList.reduce(
    (accum, curr) => {
      accum[curr.name] = curr;
      return accum;
    },
    {}))


module.exports = {
  dbReset,
  getList,
  getMap
};