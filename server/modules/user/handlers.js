var userService = require('./service');
var lobbyService = require('../lobby/service');
var sapi = require('../../sapi');
var SapiError = sapi.SapiError;
const tools = require('../tools');
const error = tools.error;
const rejectionAction = tools.rejectionAction;
const check = require('../check');
const filter = require('../filter');
const ObjectId = require("mongodb").ObjectId
var debug = require('debug')('user:handlers');
debug.log = console.log.bind(console)


const userUpdatePayload = user => ({
  _id: user ? user._id : null,
  loggedIn: user ? true : false,
  name: user ? user.name : null,
  token: user ? user.token : null
});


const handlers = {

  'USER_REGISTER': (action, ws, db) => Promise.resolve()
    .then(check.notLoggedIn(ws))
    .then(() => userService.register(db, action.payload.name, action.payload.password))
    .then(user => {
      ws.sendAction("USER_REGISTER_FULFILLED");
    })
    .catch(err => {
      ws.sendAction(rejectionAction("USER_REGISTER_REJECTED", err));
      throw err;
    }),


  'USER_LOGIN': (action, ws, db) => {
    return Promise.resolve()
      .then(check.notLoggedIn(ws))
      // authenticate user
      .then(() => {
        if (action.payload.token)
          return userService.loginByToken(db, action.payload.token);
        else
          return userService.login(db, action.payload.name, action.payload.password);
      })
      // drop parallel sessions
      .then(user => {
        ws.store.currentUser = user;
        sapi.getClients(filter.ws.concurrentById(user._id, ws)).forEach(
          client => {
            delete client.store.currentUser;
            delete client.store.lobbyId;
            client.sendAction("USER_UPDATE", userUpdatePayload(null));
            client.sendAction("USER_KICKED_OUT");
          });
        return user;
      })
      // get user's lobby
      .then(user => {
        // inner promise not to interfere main flow
        return lobbyService.get.byMemberId(db, user._id)
          .then(lobby => {
            ws.store.lobbyId = lobby._id;
          })
          .catch(err => { })
      })
      // send response
      .then(() => {
        ws.sendAction("USER_LOGIN_FULFILLED");
        ws.sendAction("USER_UPDATE", userUpdatePayload(ws.store.currentUser));
      })
      .catch(err => {
        ws.sendAction(rejectionAction("USER_LOGIN_REJECTED", err));
        throw err;
      });
  },


  'USER_LOGOUT': (action, ws, db) => Promise.resolve()
    .then(check.loggedIn(ws))
    .then(() => userService.logout(db, ws.store.currentUser.token))
    .then(user => {
      delete ws.store.currentUser;
      delete ws.store.lobbyId;
      ws.sendAction("USER_LOGOUT_FULFILLED");
      ws.sendAction("USER_UPDATE", userUpdatePayload(null));
    })
    .catch(err => {
      ws.sendAction(rejectionAction("USER_LOGOUT_REJECTED", err));
      throw err;
    }),


  'USER_UPDATE_REQUEST': (action, ws, db) => Promise.resolve()
    .then(check.loggedIn(ws))
    .then(() => userService.get.byToken(db, ws.store.currentUser.token))
    .then(user => {
      ws.store.user = user;
      ws.sendAction("USER_UPDATE", userUpdatePayload(user));
    })
    .catch(err => {
      delete ws.store.currentUser;
      delete ws.store.lobbyId;
      ws.sendAction(rejectionAction("USER_UPDATE_REJECTED", err));
      throw err;
    }),
}

module.exports = handlers;
