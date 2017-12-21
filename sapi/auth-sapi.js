const auth = require('../services/auth');

function loginResponse(user) {
  return {
    event: "auth/login/response",
    name: user.name,
    token: user.token
  }
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

module.exports = {

  'auth/register/request': function (event) {
    var ss = this;
    auth.register(event.name, event.password, function (err, user) {
      if (err) {
        ss.send(errorResponse("auth/register/error", err));
      } else {
        ss.send({ event: 'auth/register/response' });
      }
    })
  },

  'auth/login/request': function (event) {
    var ss = this;
    if (event.token) {
      auth.byToken(event.token, function (err, user) {
        if (err) {
          ss.send(errorResponse("auth/login/error", err));
        } else {
          ss.currentUser = user;
          ss.send(loginResponse(user));
        }
      });
    } else {
      auth.byCredentials(event.name, event.password, function (err, user) {
        if (err) {
          ss.send(errorResponse("auth/login/error", err));
        } else {
          ss.currentUser = user;
          ss.send(loginResponse(user));
        }
      })
    }
  },

  'auth/logout/request': function (event) {
    var ss = this;
    if (!this.currentUser) {

    }
    if (event.token) {
      auth.byToken(event.token, function (err, user) {
        if (err) {
          ss.send(errorResponse("auth/login/token/error", err));
        } else {
          ss.currentUser = user;
          ss.send(loginResponse('token', user));
        }
      });
    } else {
      auth.byCredentials(event.name, event.password, function (err, user) {
        if (err) {
          ss.send(errorResponse("auth/login/token/error", err));
        } else {
          ss.currentUser = user;
          ss.send(loginResponse('token', user));
        }
      })
    }
  },

  'timeout': function () {
    console.log("timeout!");
  },

  'error': function (err) {
    console.log(err);

  },

  'close': function (code, reason) {

    console.log(code,reason);
  }
};