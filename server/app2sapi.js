const lobbyService = require('./modules/lobby/service');
const userService = require('./modules/user/service');
const appService = require('./modules/app/service');
const tools = require('./modules/tools');
const check = require('./modules/check');
const filter = require('./modules/filter');
const sapi = require('./sapi');
const AsyncLock = require('async-lock');
const SapiError = sapi.SapiError;
var debug = require('debug')('sapi:app');
debug.log = console.log.bind(console);

var apps = {};
var lock = new AsyncLock();

const doAppUpdate = (db, lobbyId, ws) => {
  var _this = this;
  return appService.getMap(db, lobbyId)
    .then(appdataMap => {
      const sendUpdate = (client) => client.sendAction(
        "APP_UPDATE", appdataMap
      );
      if (ws)
        sendUpdate(ws);
      else
        sapi.getClients(filter.ws.byLobbyId(lobbyId)).forEach(sendUpdate);
    })
}

class AppContext {
  constructor(lock, ws, db, lobby, appdata, exists) {
    this.ws = ws;
    this.db = db;
    this.currentUser = {
      _id: ws.store.currentUser._id,
      name: ws.store.currentUser.name
    };
    this.appdata = appdata;
    this.store = this.appdata ? this.appdata.store : null;
    this.sapi = {
      me: ws,
      clients: undefined,
      lobbyMembers: undefined,
      lobbyObservers: undefined
    };
    this.lobby = lobby;
    this.isObserver = ws.store.isObserver === true;
    this.exists = exists;
  }

  _sapiFields() {
    if (this.sapi.clients === undefined) {
      this.sapi.clients = sapi.getClients(
        filter.ws.byLobbyId(this.lobby._id));
      this.sapi.lobbyMembers = this.sapi.clients.filter(
        ws => ws.isObserver !== true);
      this.sapi.lobbyObservers = this.sapi.clients.filter(
        ws => ws.isObserver === true);
    }
    return this.sapi;
  }

  forSapiClients(foo) {
    this._sapiFields().clients.forEach(foo);
  }

  forSapiLobbyMembers(foo) {
    this._sapiFields().lobbyMembers.forEach(foo);
  }

  forSapiLobbyObservers(foo) {
    this._sapiFields().lobbyObservers.forEach(foo);
  }

  terminate() {
    return appService.destroyAppdata(
      this.db,
      this.appdata.lobbyId,
      this.appdata.name
    );
  }

  doAppUpdate(ws) {
    return doAppUpdate(this.db, this.lobby._id, ws);
  }

  commit() {
    return appService.commitAppdata(this.db, this.appdata);
  }
}

const createAppContext = (ws, db, lobby, appName) => {
  if (!lobby) {
    return Promise.resolve(
      new AppContext(null, ws, db, null, null, false)
    );
  }
  return appService.getByLobbyIdAndName(db, lobby._id, appName)
    .then(appdata => {
      const exists = appdata !== null;
      if (exists === false) {
        appdata = {
          store: apps[appName].DEFAULT_STORE,
          lobbyId: lobby._id,
          name: appName,
          exclusive: apps[appName].EXCLUSIVE
        };
      }
      return new AppContext(null, ws, db, lobby, appdata, exists);
    });
}


const app2sapi = (appPath) => {
  const index = require(appPath + '/index');
  const app = {
    ...index.manifest,
    handlers: index.handlers
  };
  const actionTypes = Object.keys(app.handlers);
  const sapiHandlers = {};

  debug('registering %s', app.NAME);
  apps[app.NAME] = app;

  actionTypes.forEach(type => {
    const appHandler = app.handlers[type];
    const ctx = new tools.Context();

    sapiHandlers[type] = (action, ws, db) => Promise.resolve()
      // special case of lobby join hook where lobby is not available yet
      .then(() => {
        if (action.type == "LOBBY_JOIN_HOOK") {
          return action.payload.lobby;
        } else {
          return lobbyService.get.byIdWithMembers(db, ws.store.lobbyId);
        }
      })
      // acquire lobby
      .then(ctx.store('lobby'))
      .catch(err => {
        debug('No lobby for ' + app.NAME + '\n' + err.stack);
      })
      // create app context and run handler
      .then(() => {
        // procedure implementation
        const procedure = () => createAppContext(ws, db, ctx.lobby, app.NAME)
          .then(ctx.store('appContext'))
          .catch(err => {
            debug('No context for ' + app.NAME + '\n' + err.stack)
          })
          .then(() => {
            //console.log("APPDATA:", ctx.appContext)
            if (ctx.appContext.exists || action.type === "APP_START_HOOK")
              return appHandler(action, ctx.appContext)
          })
          .catch(err => {
            debug(err.stack);
            debug(JSON.stringify(ctx.appContext.store, null, 2));
            ctx.appContext.sapi.me.sendAction('APP_ERROR', {
              message: err.message,
              stack: err.stack
            })
          });

        // lock context
        if (ws.store.lobbyId)
          return lock.acquire(ws.store.lobbyId, procedure);
        else
          return procedure();
      });
  });
  return sapiHandlers;
}

app2sapi.doAppUpdate = doAppUpdate;


module.exports = app2sapi;
