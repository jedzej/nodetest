const tools = require('../services/tools');
const auth = require('../services/auth');


function loginResponse(user) {
  return 
}

function errorResponse(event, err) {
  return {
    event: event,
    error: {
      message: err.message,
      code: err.code
    }
  };
}

module.exports.client = {

  register: function (name, password) {
    return this.request('auth/register', {
      name: name,
      password: password
    });
  },

  login: function (name, password) {
    return this.request('auth/login', {
      name: name,
      password: password
    });
  }
}

module.exports.server = {

  'auth/register/request': function (event) {
    var sClient = this;
    auth.register(event.name, event.password, function (err, user) {
      if (err) {
        sClient.send(errorResponse("auth/register/error", err));
      } else {
        sClient.send({ event: 'auth/register/response' });
      }
    });
  },

  'auth/login/request': function (event) {
    var sClient = this;
    const getUserCallback = function (err, user) {
      if (err) {
        sClient.send(errorResponse("auth/login/error", err));
      } else {
        user.logIn(function () {
          sClient.setCurrentUser(user.name);
          sClient.send({
            event: "auth/login/response",
            name: user.name,
            token: user.token
          });
          sClient.send({
            event: "auth/update",
            name: user.name,
            token: user.token
          });
        });
      }
    }
    if (event.token) {
      auth.byToken(event.token, getUserCallback);
    } else {
      auth.byCredentials(event.name, event.password, getUserCallback);
    }
  },

  'auth/logout/request': function (event) {
    var sClient = this;
    var userId = tools.loggedInOrDie(sClient, 'auth/logout/error');
    if (userId) {
      sClient.delCurrentUser();
      sClient.send({ event: 'auth/logout/response' });
    }
  },

  'timeout': function () {
    console.log("timeout!");
  },

  'error': function (err) {
    console.log(err);
  },

  'close': function (code, reason) {
    console.log(code, reason);
  }
};