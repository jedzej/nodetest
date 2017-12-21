const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const crypto = require('crypto');

var heartBeatInterval = undefined;

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

class SockSessionClient extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    this.ws.sclient = this;
    this.ws.isAlive = true;

    ws.on('pong', this.pongResponse);

    ws.on('message', function incoming(message) {
      var msg = null;
      try {
        msg = JSON.parse(message)
      } catch (e) {
        e.errno = "ENOTPARSED";
        e.code = "ENOTPARSED";
        this.sclient.emit('error', e);
        return;
      }
      try {
        this.sclient.emit(msg.event, msg);
      } catch (e) {
        this.sclient.emit('error', e);
      }
    });

    ws.on('close', function (code, reason) {
      ws.sclient.emit('close', code, reason);
    });

    ws.on('error', function (err) {
      ws.sclient.emit('error', err);
    })

    this.registerMap(coreSignallingMap);
  }

  sendAndWait(message, resolveEvent, rejectEvent, timeout) {
    var _this = this;
    var promise = new Promise(function (resolve, reject) {
      var timeoutId;
      const clearListeners = () => {
        _this.removeListener(resolveEvent, resolveCallback);
        _this.removeListener(rejectEvent, rejectCallback);
        clearTimeout(timeoutId);
      }

      const resolveCallback = (value) => {
        clearListeners();
        resolve(value);
      }
      const rejectCallback = (cause) => {
        clearListeners();
        reject(cause);
      }

      timeoutId = setTimeout(function(){
        rejectCallback('ETIMEOUT');
      }, timeout);
      _this.once(resolveEvent, resolveCallback);
      _this.once(rejectEvent, rejectCallback);
    });
    this.send(message)
    return promise;
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
    else {
      this.emit('timeout');
      ws.terminate();
    }
  }

  pongResponse() {
    this.isAlive = true;
  }

  send(message) {
    try {
      return this.ws.send(JSON.stringify(message));
    } catch (e) {
      return undefined;
    }
  }
}

class SockSessionServer extends EventEmitter {

  start(port, heartBeatTimeout) {
    if (this.server == undefined) {
      var _this = this;
      this.server = new WebSocket.Server({ port: port });
      this.server.on('connection', function connection(ws) {
        var sclient = new SockSessionClient(ws);
        _this.emit('attach', sclient);
      });
      this.server.on('error', function error(err) {
        _this.emit('error', err);
      });
    }
    if (heartBeatInterval == undefined) {
      heartBeatInterval = setInterval(function ping() {
        for (var ws of _this.server.clients) {
          ws.sclient.heartBeat();
        }
      }, heartBeatTimeout);
    }
  }

  stop(callback) {
    if (heartBeatInterval != undefined)
      clearInterval(heartBeatInterval);
    this.server.close(callback);
  }
}

module.exports = {
  server: SockSessionServer,
  client: SockSessionClient
}
