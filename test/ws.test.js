var assert = require('assert');
const socksession = require('../services/socksession');
const WebSocket = require('ws');

describe('WS', function () {

  it('should create and be getable', function (done) {
    socksession.start(8080, 5000);

    var ws;
    var clientClosed = false;

    socksession.on('attach', function attach(sclient) {
      sclient.on('close', function(code, reason){
        clientClosed = true;
      });
      sclient.on('dupa', function(event){
        socksession.stop(function(){
          if(clientClosed)
            done();
          else
            assert.fail("Client not closed")
        });
      });
    
      ws.on('open', function open() {
        ws.send(JSON.stringify({event:'dupa'}));
      });
    });
    ws = new WebSocket('ws://localhost:8080');
  });
});
