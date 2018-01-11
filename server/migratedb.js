const dbconfig = require('./dbconfig');
const user = require('./modules/user/service');
const lobby = require('./modules/lobby/service');
const app = require('./modules/app/service');

dbconfig.connect()
  .then(client => {
    return Promise.resolve()
      .then(() => user.dbReset(dbconfig.db(client)))
      .then(() => lobby.dbReset(dbconfig.db(client)))
      .then(() => app.dbReset(dbconfig.db(client)))
      .then(() => {
        client.close()
      });
  })