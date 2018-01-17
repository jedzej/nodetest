const app2sapi = require('../../app2sapi');
var debug = require('debug')('chat:handlers');
debug.log = console.log.bind(console);

const CHAT_APP_NAME = 'chat';

const CHAT_APP_HOOKS = {};

const CHAT_APP_HANDLERS = {

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

module.exports = {
  name: CHAT_APP_NAME,
  handlers: CHAT_APP_HANDLERS,
  hooks: CHAT_APP_HOOKS,
  defaultStore: {},
  exclusive: false
}
