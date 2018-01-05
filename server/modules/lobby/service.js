const tools = require('../tools');
const userService = require('../user/service');
const ObjectId = require('mongodb').ObjectId;

const dbReset = (db) => {
  return db.dropCollection('lobby')
    .catch((err) => { console.log(err) })
    .then(() => db.createCollection('lobby'))
    .then(() => db.collection('lobby').createIndex(
      { token: 1 },
      { unique: true }
    ));
}


const getBy = (db, query) => {
  return db.collection('lobby').findOne(query);
}

const withFetchedMembers = (db, lobby) =>
  userService.getByIds(db, lobby.members)
    .then(members => {
      lobby.members = members.map(m => ({ name: m.name, id: m._id }))
      return Promise.resolve(lobby);
    })

const getFor = (db, user) =>
  getBy(db, { members: user._id })
    .then(lobby => withFetchedMembers(db, lobby));


const getList = (db) => {
  return Promise.resolve(db.collection('lobby').find({}))
    .then(cursor => cursor.toArray())
    .then((lobbies) => Promise.all(
      lobbies.map(lobby => withFetchedMembers(db, lobby))
    ));
}



const create = (db, user) => {
  return tools.genUniqueToken()
    .then(token => Promise.resolve({
      leaderId: user._id,
      members: [user._id],
      token: token
    }))
    .then(lobby => db.collection('lobby').insertOne(lobby))
    .then(result => Promise.resolve(result.ops[0]))
    .then(lobby => withFetchedMembers(db, lobby));
}


const join = (db, user, lobbyToken) => {
  return getBy(db, { token: lobbyToken })
    .then(lobby => {
      const updateQuery = [
        { token: lobby.token },
        {
          $set: {
            members: [...lobby.members, user._id]
          }
        },
        { upsert: true }
      ];
      return db.collection('lobby').updateOne(...updateQuery)
        .then(() => getFor(db, user));
    });
}

const leave = (db, user) => {
  return getBy(db, { members: user._id })
    .then(lobby => {
      var leaderId = lobby.leaderId;
      var members = lobby.members.filter((mId) => !mId.equals(user._id))

      if (members.length == 0) {
        return db.collection('lobby').deleteOne({ _id: lobby._id })
          .then((result) => {
            return Promise.resolve(null);
          });
      } else {
        if (lobby.leaderId.equals(user._id)) {
          leaderId = members[0];
        }
        const updateQuery = [
          { _id: lobby._id },
          {
            $set: {
              leaderId: leaderId,
              members: members
            }
          },
          { upsert: true }
        ];
        return db.collection('lobby')
          .updateOne(...updateQuery)
          .then(() => getBy(db, { _id: lobby._id }))
          .then((lobby) => withFetchedMembers(db, lobby));
      }
    });
}


const getCollection = (db) => {
  return db.collection('lobby');
}



module.exports = {
  getBy,
  getFor,
  dbReset,
  create,
  join,
  leave,
  getCollection,
  getList
};