const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const crypto = require('crypto');

var server = undefined;
var heartBeatInterval = undefined;

const coreSignallingMap = {
  'hello/request': function (event) {
    this.send({
      'event': 'hello/response'
    });
  }
};

class SockSessionClient extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    this.ws.sclient = this;
    this.ws.isAlive = true;

    ws.on('pong', this.pongResponse);

    ws.on('message', function incoming(message) {
      try {
        var msg = JSON.parse(message)
        this.sclient.emit(msg.event, msg);
      } catch (e) {
        console.error(e.stack)
      }
    });

    ws.on('close', function (code, reason) {
      ws.sclient.emit('close', code, reason);
    });

    ws.on('error',function(err){
      console.log(err);
    })

    this.registerMap(coreSignallingMap);
  }

  registerMap(map) {
    for (var k of Object.keys(map)) {
      this.on(k, map[k]);
    }
  }

  heartBeat() {
    if (this.ws.isAlive) {
      this.ws.ping('', false, true);
      this.ws.isAlive = false;
    }
    else
      ws.terminate();
  }

  pongResponse() {
    this.isAlive = true;
  }

  send(message) {
    try {
      return this.ws.send(JSON.stringify(message));
    } catch(e){
      return undefined;
    }
  }
}

class SockSessionServer extends EventEmitter {

  start(port, heartBeatTimeout) {
    if (server == undefined) {
      var _this = this;
      server = new WebSocket.Server({ port: port });
      server.on('connection', function connection(ws) {
        var sclient = new SockSessionClient(ws);
        _this.emit('attach', sclient);
      });
      server.on('error', function error(err){
        console.log(err.stack);
      });
    }
    if (heartBeatInterval == undefined) {
      heartBeatInterval = setInterval(function ping() {
        for (var ws of server.clients) {
          ws.sclient.heartBeat();
        }
      }, heartBeatTimeout);
    }
  }

  stop(callback) {
    if (heartBeatInterval != undefined)
      clearInterval(heartBeatInterval);
    server.close(callback);
  }
}

module.exports = new SockSessionServer();
