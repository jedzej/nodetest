const helloHandlers = require('./modules/hello/handlers');
const userHandlers = require('./modules/user/handlers');
const sapi = require('./sapi');

const rootHandlers = sapi.combineHandlers(
  helloHandlers,
  userHandlers
);

sapi.start(3004, rootHandlers);