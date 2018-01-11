const app2sapi = require('../../app2sapi');
var debug = require('debug')('chat:handlers');
debug.log = console.log.bind(console);

const handlers = {

  'CHAT_MESSAGE': (action, appContext) => {
    appContext.forSapiClients(ws => ws.sendAction({
      type: "CHAT_UPDATE",
      payload: {
        from: {
          id: appContext.currentUser._id,
          name: appContext.currentUser.name
        },
        message: action.payload.message,
        timestamp: Date.now()
      }
    }));
  }
}


module.exports = app2sapi(handlers, "chat");
