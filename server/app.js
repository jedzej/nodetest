const sapi = require('./sapi');
const dbconfig = require('./dbconfig');

const rootHandlers = sapi.combineHandlers(
  require('./modules/hello/handlers'),
  require('./modules/user/handlers'),
  require('./modules/lobby/handlers'),
  require('./modules/observer/handlers'),
  require('./modules/app/handlers'),
  require('./apps/chat/handlers'),
  require('./apps/rsp/handlers')
);

dbconfig.connect().then((client) => {
  sapi.start(3004, rootHandlers, dbconfig.db(client));
})
