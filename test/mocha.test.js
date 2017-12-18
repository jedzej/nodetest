var assert = require('assert');
const WebSocket = require('ws');
 
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);

      assert.equal(1,1,"lol");
      console.log("RZeczy")
    });
  });

  it('should connect to ws', function(done){
    const wss = new WebSocket.Server({ port: 8080 });
      wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
          console.log('received: %s', message);
          ws.close();
          wss.close();
          
        });
      
        ws.send('something');
      });

      const wsc = new WebSocket('ws://localhost:8080');
      wsc.on('open', function open() {
        wsc.send("siema");
      });

      wsc.on('error', function(err){
        console.log('error ' + err);
        done();
      })


  });
});
