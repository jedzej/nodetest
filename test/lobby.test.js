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
      sclient.registerSapi(authSapi.server);
      sclient.registerSapi(lobbySapi.server);

      ws.on('open', function open() {
        var sc = new socksession.client(ws)

        sc.registerSapi(lobbySapi.client);

        // try to register
        var register_valid = authSapi.client.register(sc, 'LobbyUser', 'pass');

        // on success  try to login
        var login_valid = register_valid.then(
          (response) => {
            return authSapi.client.login(sc, 'LobbyUser', 'pass');
          });

        // try to create lobby
        var lobby_create_valid = login_valid.then(
          (event) => {
            return lobbySapi.client.create(sc);
          });

        // try to create lobby
        lobby_create_valid.then(
          (event) => {
            console.log("Lobby created");
            done();
          })
          .catch((cause) => {
            done(cause);
          });
      });
    });
    ws = new WebSocket('ws://localhost:8090');
  });
});
