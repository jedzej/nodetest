
const handlers = {
  'HELLO': (action, ws) => {
    ws.sendAction({
      type: "HELLO_FULFILLED",
    });
  }
}

module.exports = handlers;
