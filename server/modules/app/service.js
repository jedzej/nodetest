const tools = require('../tools');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const ObjectId = require('mongodb').ObjectId;

const dbReset = (db) => {
  return db.dropCollection('appstore')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('appstore'))
    .then(() => db.collection('appstore').createIndex(
      { _lobbyId: 1, _exclusive: 1 },
      { unique: true }
    ));
}


const getList = (db, lobbyId) => {
  return Promise.resolve(db.collection('appstore').find({ _lobbyId: lobbyId }))
    .then(cursor => cursor.toArray())
    .then(apps => apps.map(app => ({
      id: app._id,
      name: app._name,
      isExclusive: app._exclusive
    })));
}


module.exports = {
  dbReset,
  getList
};