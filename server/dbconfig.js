const MongoClient = require('mongodb').MongoClient;

var env = {
  url: "mongodb://localhost:27017",
  dbName: "ggPlatform"
}

const connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(env.url, function (err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

const db = (client) => {
  return client.db(env.dbName);
}


const withDb = (promiseCreator) => {
  return connect()
    .then(client => {
      return promiseCreator(db(client))
        .then(() => {
          return client.close()
        });
    });
}

const setEnv = (envParams) => {
  env = {
    ...env,
    ...envParams
  };
}


module.exports = {
  setEnv: setEnv,
  env: env,
  connect: connect,
  db: db,
  withDb: withDb
}
