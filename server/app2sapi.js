const lobbyService = require('./modules/lobby/service');
const userService = require('./modules/user/service');
const appService = require('./modules/app/service');
const tools = require('./modules/tools');
const check = require('./modules/check');
const filter = require('./modules/filter');
const sapi = require('./sapi');
const SapiError = sapi.SapiError;
var debug = require('debug')('sapi:app');
debug.log = console.log.bind(console);


class AppContext {
  constructor(lock, ws, db, lobby, appstore, exclusive) {
    this._ws = ws;
    this._db = db;
    this.currentUser = {
      _id: ws.store.currentUser._id,
      name: ws.store.currentUser.name
    };
    this._lobby = lobby;
    this.appstore = appstore;
    this.sapi = {
      me: ws,
      clients: undefined,
      lobbyMembers: undefined,
      lobbyObservers: undefined
    }
    this.lobby = {
      members: lobby.members,
      leaderId: lobby.leaderId
    }
    this.isObserver = ws.store.isObserver === true;
  }

  _sapiFields() {
    if (this.sapi.clients === undefined) {
      this.sapi.clients = sapi.getClients(filter.ws.byLobbyId(this._lobby._id));
      this.sapi.lobbyMembers = this.sapi.clients.filter(ws => ws.isObserver !== true);
      this.sapi.lobbyObservers = this.sapi.clients.filter(ws => ws.isObserver === true);
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
    console.log("terminate ", this._lobby._id)
    return this._db.collection('appstore').deleteOne({ _lobbyId: this._lobby._id })
  }

  doAppUpdate() {
    var _this = this;
    return appService.getList(this._db, this._lobby._id)
      .then(apps => {
        _this.forSapiClients(ws => {
          ws.sendAction({
            type: "APP_UPDATE",
            payload: apps
          });
        });
      });
  }

  commit() {
    const updateQuery = [
      { _lobbyId: this._lobby._id },
      { $set: this.appstore },
      { upsert: true }
    ];
    return this._db.collection('appstore').updateOne(...updateQuery);
  }
}


const app2sapi = (appHandlers, name, defaultStore = {}, exclusive = false) => {
  var sapiHandlers = {}
  Object.keys(appHandlers).forEach(type => {
    const appHandler = appHandlers[type];
    sapiHandlers[type] = (action, ws, db) => {
      var ctx = new tools.Context();
      return lobbyService.get.byIdWithMembers(db, ws.store.lobbyId)
        .then(check.ifTrue(lobby => lobby !== null, 'Lobby does not exist', "ELOBBY"))
        .then(ctx.store('lobby'))
        .then(() => db.collection('appstore').findOne({ _lobbyId: ctx.lobby._id }))
        .then(appstore => {
          if (appstore === null) {
            appstore = {
              ...defaultStore,
              _lobbyId: ctx.lobby._id,
              _name: name,
              _exclusive: exclusive
            };
          }
          return appHandler(action, new AppContext(null, ws, db, ctx.lobby, appstore, exclusive))
        });
    }
  });
  return sapiHandlers;
}


module.exports = app2sapi;
