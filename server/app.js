const sapi = require('./sapi');
const dbconfig = require('./dbconfig');

const rootHandlers = sapi.combineHandlers(
  require('./modules/hello/handlers'),
  require('./modules/user/handlers'),
  require('./modules/lobby/handlers'),
  require('./modules/chat/handlers')
);

dbconfig.connect().then((client) => {
  sapi.start(3004, rootHandlers, dbconfig.db(client));
})
