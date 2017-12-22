const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const crypto = require('crypto');

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

class SockSessionClient extends EventEmitter {
  constructor(ws, server) {
    super();
    this.ws = ws;
    this.ws.sclient = this;
    this.ws.isAlive = true;
    this.tags = {};
    this.server = server;
    this.userId = undefined;

    ws.on('pong', this.pongResponse);

    ws.on('message', function (message) {
      console.log("in: " +message);
      var msg = null;
      try {
        msg = JSON.parse(message);
      } catch (e) {
        e.errno = "ENOTPARSED";
        e.code = "ENOTPARSED";
        this.sclient.emit('error', e);
        return;
      }
      try {
        console.log(msg.event);
        this.sclient.emit(msg.event, msg);
      } catch (e) {
        this.sclient.emit('error', e);
      }
    });

    ws.on('open', function () {
      ws.sclient.emit('open');
    });

    ws.on('close', function (code, reason) {
      ws.sclient.emit('close', code, reason);
    });

    ws.on('error', function (err) {
      ws.sclient.emit('error', err);
    })

    this.registerSapi(coreSignallingMap);
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

      timeoutId = setTimeout(function () {
        rejectCallback('ETIMEOUT');
      }, timeout);
      _this.once(resolveEvent, resolveCallback);
      _this.once(rejectEvent, rejectCallback);
    });
    this.send(message)
    return promise;
  }

  registerSapi(map) {
    for (var k of Object.keys(map)) {
      if (!k.startsWith('__'))
        this.on(k, map[k]);
    }
    if (map['__initialize__'])
      map['__initialize__'].apply(this);
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
      console.log("out: " +JSON.stringify(message));
      return this.ws.send(JSON.stringify(message));
    } catch (e) {
      return undefined;
    }
  }

  getTag(tagname) {
    return this.tags[tagname];
  }

  addTag(tagname,tagvalue) {
    if (this.tags[tagname] == undefined) {
      this.tags[tagname] = tagvalue;
    }
  }

  setCurrentUser(userId){
    this.addTag('currentUser', userId);
  }

  getCurrentUser(){
    return this.getTag('currentUser');
  }

  removeTag(tagname) {
    delete this.tags[tagname];
  }
}

class SockSessionServer extends EventEmitter {

  start(port, heartBeatTimeout) {
    if (this.server == undefined) {
      var _this = this;
      this.server = new WebSocket.Server({ port: port });
      this.server.on('connection', function connection(ws, req) {
        var sclient = new SockSessionClient(ws, _this);
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
