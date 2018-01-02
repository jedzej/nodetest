const assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const auth = require('./modules/user/service');
const dbconfig = require('./dbconfig');

describe('MongoDB', function () {

  it('should create and echo', function (done) {

    // Database Name
    const dbName = 'myproject';

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      client.close();
      done();
    });
  });
});


describe('AUTH', function () {

  it('should register', function (done) {
    dbconfig.setEnv({ dbName: 'ggPlatformDev' });
    dbconfig.connect()
      .then(client => {
        var db = dbconfig.db(client);
        auth.dbReset(db)
          .then(() => auth.register(db, 'uname', 'upass'))
          .then(user => {
            assert.equal(user.name, 'uname');
            assert.equal(user.password, 'upass');
            return client.close()
          })
          .then(() => { done() })
          .catch(err => {
            console.log(err)
          });
      })
  });

  it('should not double register', function (done) {
    dbconfig.setEnv({ dbName: 'ggPlatformDev' });
    dbconfig.connect()
      .then(client => {
        var db = dbconfig.db(client);
        auth.dbReset(db)
          .then(() => auth.register(db, 'uname', 'upass1'))
          .then(() => auth.register(db, 'uname', 'upass2'))
          .catch(err => {
            done();
          });
      });
  });

  it('should login', function (done) {
    dbconfig.setEnv({ dbName: 'ggPlatformDev' });
    dbconfig.connect()
      .then(client => {
        var db = dbconfig.db(client);
        auth.dbReset(db)
          .then(() => auth.register(db, 'uname', 'upass'))
          .then(() => auth.login(db, 'uname', 'upass'))
          .then((token) => {
            done();
          })
          .catch(err => console.log(err))
      })
  });
});
