const tools = require('../tools');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const ObjectId = require('mongodb').ObjectId;
var debug = require('debug')('lobby:service');
debug.log = console.log.bind(console);

class ServiceResult {
  static get STATUS() {
    return { "OK": "OK", "ERROR": "ERROR" }
  }

  static ok(data) {
    return new ServiceResult(ServiceResult.STATUS.OK, data)
  }

  static error(data) {
    return new ServiceResult(ServiceResult.STATUS.ERROR, data)
  }

  constructor(status, data) {
    this.status = status;
    this.data = data;
  }

  isOk() {
    return this.status === ServiceResult.STATUS.OK;
  }

  isError() {
    return this.status === ServiceResult.STATUS.ERROR;
  }

  toPromise() {
    return this.isOk() ? Promise.resolve(this.data) : Promise.reject(this.data);
  }
}

var lastResult = undefined;

const dbReset = (db) => {
  return db.dropCollection('lobby')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('lobby'))
    .then(() => db.collection('lobby').createIndex(
      { token: 1 },
      { unique: true }
    ));
}


const get = {
  byQuery: (db, query) => db.collection('lobby').findOne(query)
    .then(lobby => lobby ? Promise.resolve(lobby) : Promise.reject("Lobby not found")),

  byId: (db, id) => get.byQuery(db, { _id: id }),

  byMemberId: (db, id) => get.byQuery(db, { membersIds: id }),

  byToken: (db, token) => get.byQuery(db, { token }),

  withMembers: (db, lobby) => userService.getByIds(db, lobby.membersIds)
    .then(members => ({ ...lobby, members })),

  byIdWithMembers: (db, lobbyId) => get.byId(db, lobbyId)
    .then(lobby => get.withMembers(db, lobby)),

  list: db => db.collection('lobby').find({}).toArray()
    .then(lobbies => {
      console.log(lobbies)
      return Promise.all(
        lobbies.map(lobby => get.withMembers(db, lobby))
      )
    })

}


const create = (db, user) => {
  return tools.genUniqueToken()
    .then(token => ({
      leaderId: user._id,
      membersIds: [user._id],
      token: token
    }))
    .then(lobby => db.collection('lobby').insertOne(lobby))
    .then(result => (result.result.n == 1 && result.result.ok == 1) ?
      Promise.resolve(result.ops[0]) : Promise.reject())
}

const verifyOk = (result) => tools.verify(result => result.isOk(), new Error(result.data))(result)
  .then(result => result.data);


const join = (db, userId, token) => get.byToken(db, token)
  .then(lobby => db.collection('lobby').updateOne(
    { token: lobby.token },
    {
      $set: {
        membersIds: [...lobby.membersIds, userId]
      }
    },
    { upsert: true }
  ))
  .then(result =>
    (result.result.ok == 1 && result.modifiedCount == 1) ?
      Promise.resolve() : Promise.reject()
  );



const leave = (db, userId) => get.byMemberId(db, userId)
  .then(lobby => {
    var newLeaderId = lobby.leaderId;
    var membersIds = lobby.membersIds.filter((mId) => !mId.equals(userId))

    // last member in party is leaving
    if (membersIds.length == 0) {
      return db.collection('lobby').deleteOne({ _id: lobby._id })
        .then(result => {
          debug("DELETED", result);
          if (result.result.ok == 1 && result.deletedCount == 1) {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        });
    } else {
      // promote new leader if leader is leaving
      if (lobby.leaderId.equals(userId)) {
        newLeaderId = membersIds[0];
        debug("UserId", newLeaderId, "promoted to leader");
      }
      // construct update query
      const updateQuery = [
        { _id: lobby._id },
        {
          $set: {
            leaderId: newLeaderId,
            membersIds: membersIds
          }
        },
        { upsert: true }
      ];
      return db.collection('lobby')
        .updateOne(...updateQuery)
        .then(result => {
          if (result.result.ok == 1 && result.modifiedCount == 1) {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        });
    }
  });



const getCollection = (db) => {
  return db.collection('lobby');
}



module.exports = {
  get,
  dbReset,
  create,
  join,
  leave,
  getCollection,
};