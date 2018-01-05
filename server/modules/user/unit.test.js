const assert = require('assert');
const userService = require('./service');
const dbconfig = require('../../dbconfig');
const WebSocket = require('ws');
const sapi = require('../../sapi');
const PARTIALS = require('../testpartials')

const sendAction = sapi.test.sendAction;
const waitForAction = sapi.test.waitForAction;

const userHandlers = require('./handlers');


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

          .then(PARTIALS.userCreate(ws,'uname','upass'))

          .then((action) => {
            console.log(action);
          })
      ));
  });


  it('should get', function () {
    this.timeout(5000);
    return dbconfig.withDb(db =>
      sapi.withWS("ws://localhost:3069", ws1 =>
        sapi.withWS("ws://localhost:3069", ws2 =>
          sapi.withWS("ws://localhost:3069", ws3 => {
            var usersData = [
              { ws: ws1, name: 'uname1', password: 'upass1', id: null },
              { ws: ws2, name: 'uname2', password: 'upass2', id: null },
              { ws: ws3, name: 'uname3', password: 'upass3', id: null },
            ]
            return userService.dbReset(db)
              .then(PARTIALS.userCreate(usersData[0].ws, usersData[0].name, usersData[0].password))
              .then(user => { usersData[0].id = user.id; })
              .then(PARTIALS.userCreate(usersData[1].ws, usersData[1].name, usersData[1].password))
              .then(user => { usersData[1].id = user.id; })
              .then(PARTIALS.userCreate(usersData[2].ws, usersData[2].name, usersData[2].password))
              .then(user => { usersData[2].id = user.id; })
              .then(sendAction(ws3, () => ({
                type: "USER_GET",
                payload: { ids: usersData.map(ud => ud.id) }
              })))
              .then(waitForAction(ws3, "USER_GET_FULFILLED"))
              .then(action => {
                var users = action.payload;
                for (var i = 0; i < usersData.length; i++) {
                  assert.equal(users[i].name, usersData[i].name);
                  assert.equal(users[i].id, usersData[i].id);
                }
              });
          })
        )
      )
    )
  });
});
