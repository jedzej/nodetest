const tools = require('../tools');

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

const getFor = (db, user) => {
  return getBy(db, { members: user._id });
}


const create = (db, user) => {
  return tools.genUniqueToken()
    .then(token => Promise.resolve({
      leaderId: user._id,
      members: [user._id],
      token: token
    }))
    .then(lobby => db.collection('lobby').insertOne(lobby))
    .then(result => (Promise.resolve(result.ops[0])));
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
        .then(() => getBy(db, { _id: lobby._id }));
    });
}

const leave = (db, user) => {
  return getFor(db, user)
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
          .then(() => getBy(db, { _id: lobby._id }));
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
  getCollection
};