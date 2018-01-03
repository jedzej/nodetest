var lobbyService = require('./service');
var SapiError = require('../../sapi').SapiError;

const handlers = {

  'LOBBY_CREATE': (action, ws, db) => {
    if (ws.store.currentUser)
      lobbyService.create(db,ws.store.currentUser._id)
        .then((lobby) => {
          ws.sendAction({
            type: "LOBBY_CREATE_FULFILLED"
          });
          ws.sendAction({
            type: "LOBBY_UPDATE",
            payload: {
              token: lobby.token,
              leaderId: lobby.leaderId,
              members: lobby.members
            }
          });
        })
        .catch(err => {
          ws.sendAction({
            type: "USER_REGISTER_REJECTED",
            payload: SapiError.from(err, err.code).toPayload()
          });
        });
    else
      ws.sendAction({
        type: "USER_REGISTER_REJECTED",
        payload: SapiError.from(err, err.code).toPayload()
      });
  },

  'USER_LOGIN': (action, ws, db) => {
    var loginPromise;
    if (action.payload.token) {
      loginPromise = auth.loginByToken(db, action.payload.token);
    } else {
      loginPromise = auth.login(db, action.payload.name, action.payload.password);
    }

    loginPromise
      .then(token => {
        ws.store.currentUser = token;
        return auth.getBy(db, { token: token })
      })
      .then(user => {
        ws.sendAction({
          type: "USER_LOGIN_FULFILLED"
        });
        ws.sendAction({
          type: "USER_UPDATE",
          payload: {
            loggedIn: true,
            name: user.name,
            token: user.token
          }
        });
      })
      .catch(err => {
        ws.sendAction({
          type: "USER_REGISTER_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
      });
  },

  'USER_LOGOUT': (action, ws, db) => {
    var loginPromise;
    console.log(ws.store.currentUser)
    auth.logout(db, ws.store.currentUser)
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
      });
  }
}

module.exports = handlers;
