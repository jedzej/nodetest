const sapi = require('./sapi');
const dbconfig = require('./dbconfig');
const app2sapi = require('./app2sapi')
const appService = require('./modules/app/service')

const apps = [
  './apps/rsp',
  './apps/chat',
  './apps/paint',
  //require('./apps/chat/config')
]

const rootHandlers = sapi.combineHandlers(
  require('./modules/hello/handlers'),
  require('./modules/user/handlers'),
  require('./modules/lobby/handlers'),
  require('./modules/observer/handlers'),
  require('./modules/app/handlers'),
  ...apps.map(app => app2sapi(app))
);


dbconfig.connect().then((client) => {
  sapi.start(3004, rootHandlers, dbconfig.db(client));
})
