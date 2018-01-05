const helloHandlers = require('./modules/hello/handlers');
const userHandlers = require('./modules/user/handlers');
const lobbyHandlers = require('./modules/user/handlers');
const sapi = require('./sapi');
const dbconfig = require('./dbconfig');

const rootHandlers = sapi.combineHandlers(
  helloHandlers,
  userHandlers,
  lobbyHandlers
);


dbconfig.connect().then((client) => {
  sapi.start(3004, rootHandlers, dbconfig.db(client));
})
