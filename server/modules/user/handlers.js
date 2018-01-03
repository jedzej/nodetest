var userService = require('./service');
var SapiError = require('../../sapi').SapiError;

const handlers = {

  'USER_REGISTER': (action, ws, db) => {
    userService.register(db, action.payload.name, action.payload.password)
      .then((user) => {
        ws.sendAction({
          type: "USER_REGISTER_FULFILLED"
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_REGISTER_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
      });
  },

  'USER_LOGIN': (action, ws, db) => {
    var loginPromise;
    if (action.payload.token)
      loginPromise = userService.loginByToken(db, action.payload.token);
    else
      loginPromise = userService.login(db, action.payload.name, action.payload.password);
    loginPromise
      .then(user => {
        ws.store.currentUser = user;
        ws.sendAction({
          type: "USER_LOGIN_FULFILLED"
        });
        ws.sendAction({
          type: "USER_UPDATE",
          payload: {
            id: user._id,
            loggedIn: true,
            name: user.name,
            token: user.token
          }
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_LOGIN_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
      });
  },

  'USER_LOGOUT': (action, ws, db) => {
    userService.logout(db, ws.store.currentUser.token)
      .then(user => {
        delete ws.store.currentUser;
        ws.sendAction({
          type: "USER_LOGOUT_FULFILLED"
        });
        ws.sendAction({
          type: "USER_UPDATE",
          payload: {
            loggedIn : false,
            name: null,
            token: null
          }
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_LOGOUT_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
      });
  }
}

module.exports = handlers;
