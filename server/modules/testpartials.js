const sapi = require('../sapi');

const sendAction = sapi.test.sendAction;
const waitForAction = sapi.test.waitForAction;

module.exports = PARTIALS = {
  userCreate: (ws, name, password) => () =>
    Promise.resolve()
      .then(sendAction(ws, {
        type: "USER_REGISTER",
        payload: { name, password }
      }))
      .then(waitForAction(ws, "USER_REGISTER_FULFILLED"))
      .then(sendAction(ws, {
        type: "USER_LOGIN",
        payload: { name, password }
      }))
      .then(waitForAction(ws, "USER_LOGIN_FULFILLED"))
      .then(waitForAction(ws, "USER_UPDATE"))
      .then((action) => Promise.resolve(action.payload)),

  lobbyCreate: (ws) => () =>
    Promise.resolve()
      .then(sendAction(ws, { type: "LOBBY_CREATE" }))
      .then(waitForAction(ws, "LOBBY_CREATE_FULFILLED"))
      .then(waitForAction(ws, "LOBBY_UPDATE"))
      .then(action => Promise.resolve(action.payload))
}