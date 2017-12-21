var assert = require('assert');
const socksession = require('../services/socksession');
const WebSocket = require('ws');

describe('SockSession', function () {

  it('should create and be getable', function (done) {
    var sss = new socksession.server();
    sss.start(8080, 5000);

    var ws;
    var clientClosed = false;

    sss.on('attach', function attach(sclient) {
      sclient.on('close', function(code, reason){
        clientClosed = true;
      });
      sclient.on('testevent', function(event){
        sss.stop(function(){
          if(clientClosed)
            done();
          else
            assert.fail("Client not closed")
        });
      });
    
      ws.on('open', function open() {
        ws.send(JSON.stringify({event:'testevent'}));
      });
    });
    ws = new WebSocket('ws://localhost:8080');
  });
});
