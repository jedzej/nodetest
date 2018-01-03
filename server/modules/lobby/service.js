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


function getBy(db, query) {
  return db.collection('lobby').findOne(query);
}


const create = (db, leaderId) => {
  return tools.genUniqueToken()
    .then(token => Promise.resolve({
      leaderId: leaderId,
      members: [leaderId],
      token: token
    }))
    .then(lobby => db.collection('lobby').insertOne(lobby))
    .then(result => (Promise.resolve(result.ops[0])));
}


const join = (db, userId, lobbyToken) => {
  return getBy(db, { token: token })
    .then(lobby => {
      const updateQuery = [
        { token: lobby.token },
        {
          $set: {
            members: [...lobby.members, userId]
          }
        },
        { upsert: true }
      ];
      return db.collection('lobby').updateOne(...updateQuery)
        .then(() => getBy(db, { _id: lobby._id }));
    });
}

const leave = (db, userId) => {
  return getBy(db, { members: userId })
    .then(lobby => {
      var leaderId = lobby.leaderId;
      var members = lobby.members.filter((mId) => mId != userId)

      if (members.length == 0) {
        return db.collection('lobby').deleteOne({ _id: lobby._id })
          .then((result) => {
            console.log(result);
            return Promise.resolve();
          });
      } else {
        if (lobby.leaderId == userId) {
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
        return db.collection('lobby').updateOne(...updateQuery);
      }
    });
}



module.exports = {
  'getBy': getBy,
  'dbReset': dbReset,
  'create': create,
  'join': join,
  'leave': leave
};