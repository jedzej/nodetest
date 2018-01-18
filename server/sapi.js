const WebSocket = require('ws');
const OID = require('./object-id');

var debug = {
  connection: require('debug')('sapi:connection'),
  data: require('debug')('sapi:data'),
  handlers: require('debug')('sapi:handlers'),
  test: require('debug')('sapi:test'),
  actions: require('debug')('sapi:actions')
}
Object.values(debug).forEach((v) => {
  v.log = console.log.bind(console);
});


var server = null;
var handlersList = [];

class SapiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code
  }

  toPayload() {
    return {
      code: this.code,
      message: this.message
    }
  }

  static from(e, code) {
    return new SapiError(e.message, code);
  }
}


PromiseWhen = (promises, errHandler) => {
  const results = [];
  var chain = Promise.resolve();
  promises.forEach(promise => {
    chain = chain
      .then(() =>
        promise
          .then(result => {
            results.push(result);
          })
          .catch(err => {
            errHandler(err);
            results.push(err);
          })
      )
  });
  return chain.then(() => results)
}


function combineHandlers(...handlers) {
  var resultHandlers = {};
  for (var handler of handlers) {
    resultHandlers = {
      ...resultHandlers,
      ...handler
    };
  }
  return resultHandlers;
}


function sendAction(param1, param2) {
  var action;
  if (typeof param1 === 'string') {
    action = {
      type: param1,
      payload: param2
    }
  } else {
    action = param1;
  }
  if (action.type === undefined) {
    throw new SapiError("No action type", "EINVACTION");
  }
  try {
    const message = JSON.stringify(action, null, 2);
    this.debug.actions("=> " + action.type);//.substring(0, 100), message.length > 100 ? "..." : "");
    this.debug.data("=> " + message);//.substring(0, 100), message.length > 100 ? "..." : "");
    return this.send(message);
  } catch (e) {
    throw SapiError.from(e, "EPARSEERROR");
  }
}


const inject = (action, ws, db) => {
  ws.debug.actions("<= %s", action.type);
  const matchedHandlers = handlersList.filter(handler => handler.type === action.type);
  ws.debug.handlers("Actions handlers for [%s]: %d", action.type, matchedHandlers.length);
  return PromiseWhen(
    matchedHandlers.map(
      handler => handler(action, ws, db)
    ),
    err => { ws.debug.handlers(err.stack);throw err; }
  )/*/
  return Promise.all(
    matchedHandlers.map(
      handler => {
        console.log('calling handler', handler);
        return handler(action, ws, db);
      }
    )
  ).catch(
    err => {
      ws.debug.handlers(err.stack);
      throw err;
    })*/
}


function onConnection(db) {
  return (ws, req) => {
    ws.debug = {};
    Object.keys(debug).forEach(key => {
      ws.debug[key] = (...args) => debug[key]('[ws:%d] ' + args[0], OID(ws), ...args.slice(1));
    })
    ws.debug.connection("connection initiated " + OID(ws));
    ws.isAlive = true;
    ws.store = {};
    ws.sendAction = sendAction.bind(ws);

    ws.on('pong', function () {
      ws.isAlive = true;
    });

    ws.on('message', function (message) {
      ws.debug.data("<= " + message);//.substring(0, 100), message.length > 100 ? "..." : "");
      var action = null;
      try {
        action = JSON.parse(message);
      } catch (e) {
        ws.debug.data(SapiError.from(e, "EPARSEERROR"));
      }
      try {
        if (action.type === undefined) {
          ws.debug.data("Malformed action! No action type!");
        } else {
          inject(action, ws, db).catch(err => { })
        }
      } catch (e) {
        throw e;
      }
    });

    ws.on('open', function () {
      ws.debug.connection("connection opened");
    });

    ws.on('close', function (code, reason) {
      ws.debug.connection("connection closed, code: %s reason: %s", code, reason);
    });

    ws.on('error', function (err) {
      ws.debug.connection("connection error: %s", err);
    })
  }
}


const start = (port, handlers, db) => {
  if (server === null) {
    new Promise((resolve, reject) => {
      server = new WebSocket.Server({ port });

      Object.keys(handlers).forEach(type => {
        handlers[type].type = type;
        handlersList.push(handlers[type]);
        debug.handlers("Registering handler: " + type)
      })

      server.on('connection', onConnection(db));
      server.on('open', resolve);
      server.on('error', reject);


      // heart beat
      if (server.heartBeatInterval == undefined) {
        server.heartBeatInterval = setInterval(function ping() {
          for (var ws of server.clients) {
            if (ws.isAlive) {
              ws.ping('', false, true);
              ws.isAlive = false;
            }
            else {
              ws.debug.connection('Dead connection terminating');
              ws.terminate();
            }
          }
        }, 5000);
      }
    });
  }
}

const stop = (cb) => {
  if (server !== null) {
    server.close(cb)
  }
}


const getClients = filter => {
  var members = Array.from(server.clients);
  if (filter)
    members = members.filter(filter);
  return members;
}


module.exports = {
  start,
  stop,
  combineHandlers,
  SapiError,
  getClients,
  inject
}
