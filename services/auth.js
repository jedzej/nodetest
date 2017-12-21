var EventEmitter = require('events');
var crypto = require('crypto');

var users = [];

var sessionClientMap = {};

function getUserByToken(token, callback) {
  var user = users.find((u) => u.token == token);
  if (user) {
    callback(null, user);
  } else {
    var err = new Error('User does not exist');
    err.code = 'EINVALIDUSER';
    callback(err);
  }
}

function genUniqueToken(callback) {
  crypto.randomBytes(48, function (err, buffer) {
    if (err) {
      callback(err);
    } else {
      var token = buffer.toString('hex');
      getUserByToken(token, function (err, user) {
        if (err) {
          if (err.code == "EINVALIDUSER") {
            callback(null, token);
          } else {
            callback(err);
          }
        } else {
          genUniqueToken(callback)
        }
      });
    }
  });
}

function getByCredentials(username, password, callback) {
  var user = users.find((u) => u.name == username);
  if (user) {
    if (user.password == password) {
      callback(null, user);
    } else {
      var err = new Error('Invalid password');
      err.code = 'EINVALIDPASS';
      callback(err);
    }
  } else {
    var err = new Error('User does not exist');
    err.code = 'EINVALIDUSER';
    callback(err);
  }
}

function getByToken(token, callback) {
  return getUserByToken(token, callback);
}

class User {

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  logIn(sessionClient, callback) {
    if (this.token === undefined) {
      var _this = this;
      genUniqueToken(function (err, token) {
        if (err) {
          callback(err);
        } else {
          _this.token = token;
          sessionClientMap[_this.token] = sessionClient;
          callback(null);
        }
      });
    } else {
      sessionClientMap[this.token] = sessionClient;
      callback(null);
    }
  }

  isOnline() {
    return this.token != undefined;
  }

  getSessionClient() {
    if (this.isOnline())
      return sessionClientMap[this.token];
  }

  logOut(callback) {
    delete sessionClientMap[this.token];
    delete this.token;
    callback(null);
  }
}

function register(name, password, callback) {
  if (users.find((u) => u.name == name)) {
    var err = new Error('User already exists!');
    err.code = "EUSEREXISTS";
    callback(err);
  } else {
    var user = new User(name, password)
    users.push(user);
    callback(null, user);
  }
}

module.exports = {
  'byToken': getByToken,
  'byCredentials': getByCredentials,
  'register': register
};
