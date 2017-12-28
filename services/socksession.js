const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const crypto = require('crypto');
const SockSessionClient = require('./socksession-client');

var heartBeatInterval = undefined;

var servers = [];

function createError(message, errno, code) {
  var error = new Error(message);
  error.errno = errno;
  error.code = code;
  return error;
}

const coreSignallingMap = {
  'hello/request': function (event) {
    this.send({
      'event': 'hello/response'
    });
  }
};


class SockSessionServer extends EventEmitter {

  start(port, heartBeatTimeout) {
    if (this.server == undefined) {
      var _this = this;
      this.server = new WebSocket.Server({ port: port });
      this.server.on('connection', function connection(ws, req) {
        var sclient = new SockSessionClient(ws, _this);
        sclient.registerSapi(coreSignallingMap);
        _this.emit('attach', sclient);
      });
      this.server.on('error', function error(err) {
        _this.emit('error', err);
      });
    }
    servers.push(this);
    if (heartBeatInterval == undefined) {
      heartBeatInterval = setInterval(function ping() {
        for (var ws of _this.server.clients) {
          ws.sclient.heartBeat();
        }
      }, heartBeatTimeout);
    }
  }

  forClientsByTag(tagname, tagvalue, callback) {
    for (var ws of this.server.clients) {
      if (ws.sclient.getTag(tagname) == tagvalue) {
        callback(ws.sclient);
      }
    }
  }

  stop(callback) {
    var _this = this;
    if (heartBeatInterval != undefined)
      clearInterval(heartBeatInterval);
    this.server.close(function(){
      servers = servers.filter((element) => element != this);
      callback();
    });
  }
}

function getClientByTag(tagname, tagvalue){
  for(var server of servers){
    for (var ws of server.clients) {
      if (ws.sclient.getTag(tagname) == tagvalue) {
        return ws.sclient;
      }
    }
  }
}


module.exports = {
  server: SockSessionServer,
  client: SockSessionClient,
  getClientByTag : getClientByTag
}
