const assert = require('assert');
const sapi = require('./sapi');
const WebSocket = require('ws');

describe('SAPI', function () {

  const echoHandler = {
    'ECHO': (action, ws) => {
      ws.sendAction({ type: 'ECHO' });
    }
  };
  const upperHandler = {
    'UPPER': (action, ws) => {
      ws.sendAction({
        type: 'UPPER_RESOLVED',
        payload: action.payload.toUpperCase()
      });
    }
  };

  it('should create and echo', function (done) {
    sapi.start(8080, echoHandler);
    var ws = new WebSocket('ws://localhost:8080');
    ws.on('message', (message) => {
      assert.equal(JSON.parse(message).type, 'ECHO');
      sapi.stop();
    });
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: "ECHO" }));
    });
    ws.on('close', () => {
      done();
    })
  });

  it('should serve many handlers', function (done) {
    setTimeout(() => {
      sapi.start(8080, sapi.combineHandlers(echoHandler, upperHandler));
      var ws = new WebSocket('ws://localhost:8080');
      ws.on('message', (message) => {
        assert.equal(JSON.parse(message).type, 'ECHO');
        sapi.stop(() => {
          done()
        });
      });
      ws.on('open', () => {
        ws.send(JSON.stringify({ type: "ECHO" }));
      });
    }, 1000);
  });
});
