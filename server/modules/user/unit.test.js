const assert = require('assert');
const userService = require('./service');
const dbconfig = require('../../dbconfig');
const sendAction = require('../tools').sendAction;
const waitForAction = require('../tools').waitForAction;
const WebSocket = require('ws');
const sapi = require('../../sapi');

const userHandlers = require('./handlers');

const logThrough = msg => arg => {
  console.log(msg);
  return Promise.resolve(arg)
}


describe('User', function () {


  before(() => {
    dbconfig.setEnv({ dbName: 'ggPlatformDev' });
    return dbconfig.connect().then((client) => {
      return sapi.start(3069, userHandlers, dbconfig.db(client));
    })
  });


  after(() => {
    sapi.stop();
  })


  it('should register', function () {
    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", ws =>
        userService.dbReset(db)
          .then(sendAction(ws, {
            type: "USER_REGISTER",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_REGISTER_FULFILLED"))
          .then(sendAction(ws, {
            type: "USER_REGISTER",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_REGISTER_REJECTED"))
      ));
  });

  it('should not double register', function () {
    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", ws =>
        userService.dbReset(db)
          .then(sendAction(ws, {
            type: "USER_REGISTER",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_REGISTER_FULFILLED"))
          .then(sendAction(ws, {
            type: "USER_REGISTER",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_REGISTER_REJECTED"))
      ));
  });

  it('should login', function () {
    return dbconfig.withDb((db) =>
      sapi.withWS("ws://localhost:3069", ws =>
        userService.dbReset(db)

          .then(sendAction(ws, {
            type: "USER_LOGIN",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_LOGIN_REJECTED"))

          .then(sendAction(ws, {
            type: "USER_REGISTER",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_REGISTER_FULFILLED"))

          .then(sendAction(ws, {
            type: "USER_LOGIN",
            payload: { name: 'uname', password: 'upass' }
          }))
          .then(waitForAction(ws, "USER_LOGIN_FULFILLED"))
          .then(waitForAction(ws, "USER_UPDATE"))

          .then((action) => {
            console.log(action);
          })
      ));
  });
});
