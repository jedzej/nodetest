var assert = require('assert');
const auth = require('../services/auth');
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


describe('Auth', function () {
  it('should register and log in via AUTH api', function (done) {
    // register
    auth.register('Kasia', 'kasia123', function (err, user) {
      assert.equal(err, null)
      assert.equal(user.name, 'Kasia');
      // try to register with the same credentials
      auth.register('Kasia', 'lol', function (err, user) {
        assert.equal(err.code, 'EUSEREXISTS');
      });
      // login by credentials
      auth.byCredentials('Kasia', 'kasia123', function (err, userByCredentials) {
        assert.equal(err, null);
        assert.equal(userByCredentials.name, 'Kasia');
        assert.ok(userByCredentials.token === undefined);
        // create token
        userByCredentials.logIn(function () {
          // login by token
          auth.byToken(userByCredentials.token, function (err, userByToken) {
            assert.equal(err, null);
            assert.equal(userByToken, userByCredentials);
            // logout
            userByCredentials.logOut(function () {
              assert.ok(!user.token);
              done();
            });
          });
        });
      });
    });
  });

  it('should register and log in via AUTH-SAPI', function (done) {
    var sss = new socksession.server();
    sss.start(8080, 5000);


    sss.on('attach', function attach(sclient) {
      sclient.registerSapi(authSapi);

      ws.on('open', function open() {
        var sclient = new socksession.client(ws)

        // try to register
        var register_valid = sclient.sendAndWait({
          event: 'auth/register/request',
          name: 'Username',
          password: 'pass'
        }, 'auth/register/response', 'auth/register/error', 2000);

        // on success  try to register again and expect failure
        var register_double = register_valid.then(
          (response) => {
            assert.equal(response.event, 'auth/register/response');
            return sclient.sendAndWait({
              event: 'auth/register/request',
              name: 'Username',
              password: 'pass'
            }, 'auth/register/response', 'auth/register/error', 2000)
          },
          null);

        // handler failure
        register_double.then(
          null,
          (cause) => {
            assert.notEqual(cause, 'ETIMEOUT');
            assert.equal(cause.error.code, 'EUSEREXISTS');
            assert.equal(cause.event, 'auth/register/error');

            var login = sclient.sendAndWait({
              event: 'auth/login/request',
              name: 'Username',
              password: 'pass'
            }, 'auth/login/response', 'auth/login/error', 10000);

            login.then(
              (response) => {
                assert.equal(response.event, 'auth/login/response');
                assert.equal(response.name, 'Username');
                assert.ok(response.token);
                sss.stop(()=>{
                  done();
                });
              },
              (cause)=>{
                console.log(cause);
              }
            )
          });

      });
    });
    ws = new WebSocket('ws://localhost:8080');
  });
});
