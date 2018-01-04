const assert = require('assert');
const userService = require('./service');
const dbconfig = require('../../dbconfig');
const WebSocket = require('ws');
const sapi = require('../../sapi');

const sendAction = sapi.test.sendAction;
const waitForAction = sapi.test.waitForAction;

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


  it('should get', function () {
    return dbconfig.withDb(db =>
      sapi.withWS("ws://localhost:3069", ws1 => 
        sapi.withWS("ws://localhost:3069", ws2 => 
          sapi.withWS("ws://localhost:3069", ws3 => {
            var usersData = [
              { name: 'uname1', password: 'upass1' },
              { name: 'uname2', password: 'upass2' },
              { name: 'uname3', password: 'upass3' }
            ]
            var ids = [];
            var ws = ws1;
            return userService.dbReset(db)
              .then(sendAction(ws1, { type: "USER_REGISTER", payload: usersData[0] }))
              .then(waitForAction(ws1, "USER_REGISTER_FULFILLED"))
              .then(sendAction(ws1, { type: "USER_LOGIN", payload: usersData[0] }))
              .then(waitForAction(ws1, "USER_LOGIN_FULFILLED"))
              .then(waitForAction(ws1, "USER_UPDATE"))
              .then((action) => { ids.push(action.payload.id); })
              .then(sendAction(ws2, { type: "USER_REGISTER", payload: usersData[1] }))
              .then(waitForAction(ws2, "USER_REGISTER_FULFILLED"))
              .then(sendAction(ws2, { type: "USER_LOGIN", payload: usersData[1] }))
              .then(waitForAction(ws2, "USER_LOGIN_FULFILLED"))
              .then(waitForAction(ws2, "USER_UPDATE"))
              .then((action) => { ids.push(action.payload.id); })
              .then(sendAction(ws3, { type: "USER_REGISTER", payload: usersData[2] }))
              .then(waitForAction(ws3, "USER_REGISTER_FULFILLED"))
              .then(sendAction(ws3, { type: "USER_LOGIN", payload: usersData[2] }))
              .then(waitForAction(ws3, "USER_LOGIN_FULFILLED"))
              .then(waitForAction(ws3, "USER_UPDATE"))
              .then((action) => { ids.push(action.payload.id); })
              .then(sendAction(ws3, {
                type:"USER_GET",
                payload: {ids: ids}
              }))
              .then(waitForAction(ws3, "USER_GET_FULFILLED"))
              .then(action => {
                console.log(action)
              } )
          })
        )
      )
    )
  });
});
