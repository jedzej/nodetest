var userService = require('./service');
var lobbyService = require('../lobby/service');
var sapi = require('../../sapi');
var SapiError = sapi.SapiError;
var tools = require('../tools');
const ObjectId = require("mongodb").ObjectId
var debug = require('debug')('user:handlers');
debug.log = console.log.bind(console)

const userUpdatePayload = user => ({
  id: user ? user._id : null,
  loggedIn: user ? true : false,
  name: user ? user.name : null,
  token: user ? user.token : null
});

const handlers = {

  'USER_GET': (action, ws, db) => {
    return Promise.all(
      action.payload.ids.map(id => userService.getBy(db, { _id: new ObjectId(id) }))
    )
      .then(users => {
        ws.sendAction({
          type: "USER_GET_FULFILLED",
          payload: users.map(user => ({
            id: user._id,
            name: user.name
          }))
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
      // authenticate user
      .then(() => {
        if (action.payload.token)
          return userService.loginByToken(db, action.payload.token);
        else
          return userService.login(db, action.payload.name, action.payload.password);
      })
      .then((user) => tools.verify(user != null, new SapiError("Authentication error!", "EAUTH"))(user))
      // drop parallel sessions
      .then(user => {
        sapi.getClients(
          wsc => wsc != ws && wsc.store.currentUser && wsc.store.currentUser._id.equals(user._id)
        ).forEach(
          wsc => {
            delete wsc.store.currentUser;
            wsc.sendAction({
              type: "USER_UPDATE",
              payload: userUpdatePayload(null)
            });
            wsc.sendAction({
              type: "USER_KICKED_OUT"
            });
          });
        ws.store.currentUser = user;
        debug("User", user)
        return Promise.resolve(user);
      })
      // get user's lobby
      .then(user => lobbyService.getBy(db, { members: user._id }))
      .then(lobby => {
        debug("Lobby", lobby);

        if (lobby)
          ws.store.lobbyId = lobby._id

        ws.sendAction({
          type: "USER_LOGIN_FULFILLED"
        });
        ws.sendAction({
          type: "USER_UPDATE",
          payload: userUpdatePayload(ws.store.currentUser)
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
    return tools.verify(ws.store.currentUser !== undefined, new SapiError("EAUTH", "Not logged in!"))()
      .then(() => userService.logout(db, ws.store.currentUser.token))
      .then(user => {
        delete ws.store.currentUser;
        ws.sendAction({
          type: "USER_LOGOUT_FULFILLED"
        });
        ws.sendAction({
          type: "USER_UPDATE",
          payload: userUpdatePayload(null)
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_LOGOUT_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      });
  },

  'USER_UPDATE_REQUEST': (action, ws, db) => {
    return tools.verify(ws.store.currentUser !== undefined, new SapiError("EAUTH", "Not logged in!"))()
      .then(() => userService.getBy(db, { token: ws.store.currentUser.token }))
      .then(user => tools.verify(user, new SapiError("EAUTH", "User does not exist!"))(user))
      .then(user => {
        ws.store.user = user;
        ws.sendAction({
          type: "USER_UPDATE",
          payload: userUpdatePayload(user)
        })
      })
      .catch(err => {
        delete ws.store.currentUser;
        ws.sendAction({
          type: "USER_UPDATE_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        })
      });
  },
}

module.exports = handlers;
