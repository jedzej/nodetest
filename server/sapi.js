const WebSocket = require('ws');


var server = null;


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


function combineHandlers(...handlers) {
  var resultHandlers = {};
  for (var handler of handlers) {
    resultHandlers = {
      ...resultHandlers,
      ...handler
    }
  }
  return resultHandlers;
}


function sendAction(action) {
  if (action.type === undefined) {
    throw new WSError("No action type", "EINVACTION");
  }
  try {
    return this.send(JSON.stringify(action));
  } catch (e) {
    throw WSError.from(e, "EPARSEERROR");
  }
}

function onConnection(handlers) {
  return (ws, req) => {
    console.log("WS connection");
    ws.isAlive = true;
    ws.store = {};
    ws.sendAction = sendAction.bind(ws);

    ws.on('pong', function () {
      ws.isAlive = true;
    });

    ws.on('message', function (message) {
      console.log("SAPI incoming message: " + message);
      var action = null;
      try {
        action = JSON.parse(message);
      } catch (e) {
        console.error(SapiError.from(e, "EPARSEERROR"));
      }
      try {
        if (action.type === undefined) {
          console.error("No action type: ", action);
        } else if (handlers[action.type] !== undefined) {
          console.log("Calling handler for action: " + action.type);
          handlers[action.type](action, ws)
        } else {
          console.log("No handler for action: " + action.type);
        }
      } catch (e) {
        console.error(SapiError.from(e, "EUNKNOWN"));
      }
    });

    ws.on('open', function () {
      console.error('WS opened');
    });

    ws.on('close', function (code, reason) {
      console.error('WS closed', code, reason);
    });

    ws.on('error', function (err) {
      console.error('WS error: ', err);
    })
  }
}


const start = (port, handlers) => {
  if (server === null) {
    server = new WebSocket.Server({ port });
    server.on('connection', onConnection(handlers));

    // heart beat
    if (server.heartBeatInterval == undefined) {
      server.heartBeatInterval = setInterval(function ping() {
        for (var ws of server.clients) {
          if (ws.isAlive) {
            ws.ping('', false, true);
            ws.isAlive = false;
          }
          else {
            console.error('Dead connection terminating')
            ws.terminate();
          }
        }
      }, 5000);
    }
  }
}

const stop = (cb) => {
  if (server !== null) {
    server.close(cb)
  }
}

module.exports = {
  start,
  stop,
  combineHandlers,
  SapiError
}