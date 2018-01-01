const assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';


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
