var auth = require('../../services/auth');

const handlers = {
  'HELLO': (action, ws) => {
    ws.sendAction({
      type: "HELLO_RESOLVED",
    });
  }
}

module.exports = handlers;
