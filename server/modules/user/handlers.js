var auth = require('../../services/auth');
var SapiError = require('../../sapi').SapiError;

const handlers = {

  'USER_REGISTER': (action, ws) => {
    auth.register(action.payload.name, action.payload.password, function (err, user) {
      if (err) {
        ws.sendAction({
          type: "USER_REGISTER_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
      } else {
        ws.sendAction({
          type: "USER_REGISTER_RESOLVED"
        });
      }
    });
  },

  'USER_LOGIN': (action, ws) => {
    const getUserCallback = (err, user) => {
      if (err) {
        delete ws.store.currentUser;
        ws.sendAction({
          type: "USER_LOGIN_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
      } else {
        user.logIn(function () {
          ws.store.currentUser = user.name;
          ws.sendAction({
            type: "USER_LOGIN_RESOLVED",
            payload: {
              name: user.name,
              token: user.token
            }
          });
          ws.sendAction({
            type: "USER_UPDATE",
            payload: {
              name: user.name,
              token: user.token
            }
          });
        });
      }
    }
    if (action.payload.token) {
      auth.byToken(
        action.payload.token,
        getUserCallback);
    } else {
      auth.byCredentials(action.payload.name,
        action.payload.password,
        getUserCallback);
    }
  }
}

module.exports = handlers;
