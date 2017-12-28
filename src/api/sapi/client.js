import coreSapi from 'api/sapi/core';
import authSapi from 'api/sapi/auth';
import lobbySapi from 'api/sapi/lobby';
import EventEmitter from 'events';

var sClient;

class SessionClient extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    ws.sclient = this;
    this.tags = {};
    this.timeout = 10000;

    ws.onmessage = function (message) {
      console.log(message)
      console.log("in: " + message.data);
      var msgs = null;
      try {
        msgs = JSON.parse(message.data);
      } catch (e) {
        e.errno = "ENOTPARSED";
        e.code = "ENOTPARSED";
        this.sclient.emit('error', e);
        return;
      }
      try {
        if (!Array.isArray(msgs)) {
          msgs = [msgs];
        }
        for (var msg of msgs) {
          console.log(msg.event);
          this.sclient.emit(msg.event, msg);
        }
      } catch (e) {
        this.sclient.emit('error', e);
      }
    };

    ws.onopen = function () {
      ws.sclient.emit('open');
    };

    ws.onclose = function (code, reason) {
      ws.sclient.emit('close', code, reason);
    };

    ws.onerror = function (err) {
      ws.sclient.emit('error', err);
    };
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
      _this.once(rejectEvent, rejectCallback);
    });
    this.send(message)
    return promise;
  }

  request(eventBase, data) {
    const message = { ...data, event: eventBase + '/request' };
    return this.sendAndWait(message, eventBase + '/response', eventBase + '/error');
  }

  send(message) {
    try {
      if(typeof message === "string")
        message = {event:message};
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
    if (this.tags[tagname] === undefined) {
      this.tags[tagname] = tagvalue;
    }
  }

  removeTag(tagname) {
    delete this.tags[tagname];
  }
}


export function initialize(address) {
  if (sClient === undefined) {
    sClient = new SessionClient(new WebSocket(address));
    sClient.on('open', function () {
      console.log("OPEN")
      authSapi.attach(sClient);
      coreSapi.attach(sClient);
      lobbySapi.attach(sClient);
    })
  }
}

export function on(event, callback) {
  sClient.on(event, callback);
}

export function addListener(event, callback) {
  sClient.addListener(event, callback);
}

export function removeListener(event, callback) {
  sClient.removeListener(event, callback);
}

export function once(event, callback) {
  sClient.once(event, callback);
}
