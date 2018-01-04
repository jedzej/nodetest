var userService = require('./service');
var SapiError = require('../../sapi').SapiError;
var tools = require('../tools');
const ObjectId = require("mongodb").ObjectId

const handlers = {

  'USER_GET': (action, ws, db) => {
    return Promise.all(
      action.payload.ids.map(id => userService.getBy(db, { _id: new ObjectId(id) }))
    )
      .then(users => {
        ws.sendAction({
          type: "USER_GET_FULFILLED",
          payload: {
            users: users.map(user => ({
              id: user._id,
              name: user.name
            }))
          }
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_GET_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      })
  },

  'USER_REGISTER': (action, ws, db) => {
    return tools.verify(ws.store.currentUser === undefined, new SapiError("EAUTH", "Already logged in!"))()
      .then(() => userService.register(db, action.payload.name, action.payload.password))
      .then(user => {
        ws.sendAction({
          type: "USER_REGISTER_FULFILLED"
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_REGISTER_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      })
  },

  'USER_LOGIN': (action, ws, db) => {
    return tools.verify(ws.store.currentUser === undefined, new SapiError("EAUTH", "Already logged in!"))()
      .then(() => {
        if (action.payload.token)
          return userService.loginByToken(db, action.payload.token);
        else
          return userService.login(db, action.payload.name, action.payload.password);
      })
      .then(user => {
        console.log("USER ", user)
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
        throw err;
      });
  },

  'USER_LOGOUT': (action, ws, db) => {
    return tools.verify(ws.store.currentUser === undefined, new SapiError("EAUTH", "Not logged in!"))()
      .then(() => userService.logout(db, ws.store.currentUser.token))
      .then(user => {
        delete ws.store.currentUser;
        ws.sendAction({
          type: "USER_LOGOUT_FULFILLED"
        });
        ws.sendAction({
          type: "USER_UPDATE",
          payload: {
            loggedIn: false,
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
        throw err;
      });
  }
}

module.exports = handlers;
