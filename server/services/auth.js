var EventEmitter = require('events');
var crypto = require('crypto');
const tools = require('./tools');

var users = [];

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

function getByName(username, callback) {
  var user = users.find((u) => u.name == username);
  if (user) {
    console.log(user, users)
    callback(null, user);
  } else {
    var err = new Error('User does not exist');
    err.code = 'EINVALIDUSER';
    callback(err);
  }
}

function getByCredentials(username, password, callback) {
  getByName(username, function(err, user){
    if (user) {
      if (user.password == password) {
        callback(null, user);
      } else {
        var err = new Error('Invalid password');
        err.code = 'EINVALIDPASS';
        callback(err);
      }
    } else {
      callback(err);
    }
  });
}

function getByToken(token, callback) {
  return getUserByToken(token, callback);
}

class User {

  constructor(name, password) {
    this.name = name;
    this.password = password;
  }

  logIn(callback) {
    if (this.token === undefined) {
      var _this = this;
      tools.genUniqueToken(function (err, token) {
        if (err) {
          callback(err);
        } else {
          _this.token = token;
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  }

  logOut(callback) {
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
  'byUserId': getByName,
  'register': register
};
