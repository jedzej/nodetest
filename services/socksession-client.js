var EventEmitter = require('events');

class SockSessionClient extends EventEmitter {
  constructor(ws, server) {
    super();
    this.ws = ws;
    this.ws.sclient = this;
    this.ws.isAlive = true;
    this.tags = {};
    this.server = server;
    this.userId = undefined;
    this.timeout = 10000;

    ws.on('pong', this.pongResponse);

    ws.on('message', function (message) {
      console.log("in: " + message);
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
      }, timeout ? timeout : _this.timeout);
      _this.once(resolveEvent, resolveCallback);
      console.log("PROMISE resolve: " + resolveEvent);
      _this.once(rejectEvent, rejectCallback);
      console.log("PROMISE reject: " + rejectEvent);
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

  request(eventBase, data) {
    const message = { ...data, event: eventBase + '/request' };
    return this.sendAndWait(message, eventBase + '/response', eventBase + '/error');
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
      console.log("out: " + JSON.stringify(message));
      return this.ws.send(JSON.stringify(message));
    } catch (e) {
      return undefined;
    }
  }

  getTag(tagname) {
    return this.tags[tagname];
  }

  addTag(tagname, tagvalue) {
    if (this.tags[tagname] == undefined) {
      this.tags[tagname] = tagvalue;
    }
  }

  setCurrentUser(userId) {
    this.addTag('currentUser', userId);
  }

  getCurrentUser() {
    return this.getTag('currentUser');
  }

  delCurrentUser() {
    if (this.getCurrentUser())
      self.removeTag('currentUser');
  }

  removeTag(tagname) {
    delete this.tags[tagname];
  }
}

module.exports = SockSessionClient