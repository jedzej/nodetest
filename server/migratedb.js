const dbconfig = require('./dbconfig');
const auth = require('./modules/user/service');

dbconfig.connect()
  .then(client => {
    auth.dbReset(dbconfig.db(client))
      .then(() => {
        client.close()
      });
  })