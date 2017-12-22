var assert = require('assert');
const lobby = require('../services/lobby');
const lobbySapi = require('../sapi/lobby-sapi');
const authSapi = require('../sapi/auth-sapi');
const socksession = require('../services/socksession');
const WebSocket = require('ws');

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    promise.then(resolve);
    setTimeout(function () {
      reject(new Error('Timeout')); // (A)
    }, ms);
  });
}


describe('Lobby', function () {
  it('should create and join the lobby via LOBBY-SAPI', function (done) {
    var sss = new socksession.server();
    sss.start(8090, 5000);


    sss.on('attach', function attach(sclient) {
      sclient.registerSapi(authSapi);
      sclient.registerSapi(lobbySapi);

      ws.on('open', function open() {
        var sc = new socksession.client(ws)

        // try to register
        var register_valid = sc.sendAndWait({
          event: 'auth/register/request',
          name: 'LobbyUser',
          password: 'pass'
        }, 'auth/register/response', 'auth/register/error', 2000);

        // on success  try to login
        var login_valid = register_valid.then(
          (response) => {
            return sc.sendAndWait({
              event: 'auth/login/request',
              name: 'LobbyUser',
              password: 'pass'
            }, 'auth/login/response', 'auth/login/error', 2000);
          });

        // try to create lobby
        var lobby_create_valid = login_valid.then(
          (event) => {
            return sc.sendAndWait({
              event: 'lobby/create/request'
            }, 'lobby/create/response', 'lobby/create/error', 2000);
          });

        // try to create lobby
        lobby_create_valid.then(
          (event) => {
            done();
          },
          (cause) => {
            assert.fail();
            console.log(cause);
          });
      });
    });
    ws = new WebSocket('ws://localhost:8090');
  });
});
