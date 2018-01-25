const tools = require('../tools');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const ObjectId = require('mongodb').ObjectId;

var debug = require('debug')('app:service');
debug.log = console.log.bind(console);


const dbReset = (db) => {
  return db.dropCollection('appdata')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('appdata'))
    .then(() => db.collection('appdata')
      .createIndex(
      { lobbyId: 1, exclusive: 1 },
      { unique: true }
      ))
    .then(() => db.collection('appdata')
      .createIndex(
      { lobbyId: 1, name: 1 },
      { unique: true }
      ));
}


const destroyAppdata = (db, lobbyId, name = null) => {
  var query;
  if (name) {
    debug('Destroy app %s for %s', name, lobbyId);
    query = { lobbyId: lobbyId, name: name };
  }
  else {
    debug('Destroy all apps for %s', lobbyId);
    query = { lobbyId: lobbyId };
  }
  return db.collection('appdata')
    .deleteOne(query)
    .then(cmdRes => (cmdRes.result.ok == 1 && cmdRes.result.n == 1) ?
      Promise.resolve() : Promise.reject("Not deleted"));
}

const commitAppdata = (db, appdata) =>
  db.collection('appdata').updateOne(
    { lobbyId: appdata.lobbyId },
    { $set: appdata },
    { upsert: true }
  );


const getByLobbyIdAndName = (db, lobbyId, name) =>
  db.collection('appdata').findOne({
    lobbyId: lobbyId,
    name: name
  })


const getList = (db, lobbyId) => {
  return db.collection('appdata')
    .find({ lobbyId: lobbyId })
    .toArray();
}


const getMap = (db, lobbyId) => getList(db, lobbyId)
  .then(appdataList => appdataList.reduce(
    (accum, curr) => {
      accum[curr.name] = curr;
      return accum;
    }, {}))

const getExclusive = (db, lobbyId) =>
  db.collection('appdata')
    .findOne({ lobbyId: lobbyId, exclusive: true })
    .then(app =>
      app ? Promise.resolve(app) : Promise.reject("No exclusive map")
    );


module.exports = {
  dbReset,
  getByLobbyIdAndName,
  getList,
  getMap,
  getExclusive,
  commitAppdata,
  destroyAppdata
};