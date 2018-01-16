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
  constructor(lock, ws, db, lobby, appdata) {
    this.ws = ws;
    this.db = db;
    this.currentUser = {
      _id: ws.store.currentUser._id,
      name: ws.store.currentUser.name
    };
    this.appdata = appdata;
    this.store = this.appdata.store;
    this.sapi = {
      me: ws,
      clients: undefined,
      lobbyMembers: undefined,
      lobbyObservers: undefined
    }
    this.lobby = lobby;
    this.isObserver = ws.store.isObserver === true;
  }

  _sapiFields() {
    if (this.sapi.clients === undefined) {
      this.sapi.clients = sapi.getClients(filter.ws.byLobbyId(this.lobby._id));
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
    console.log("terminate ", this.lobby._id)
    return this.db.collection('appdata').deleteOne({
      lobbyId: this.appdata.lobbyId,
      name: this.appdata.name
    })
  }

  doAppUpdate(ws) {
    var _this = this;
    return appService.getMap(this.db, this.lobby._id)
      .then(appdataList => {
        const sendUpdate = (client) => client.sendAction(
          "APP_UPDATE", appdataList
        )
        if (ws)
          sendUpdate(ws);
        else
          _this.forSapiClients(sendUpdate);
      })
  }

  commit() {
    const updateQuery = [
      { _lobbyId: this.lobby._id },
      { $set: this.appdata },
      { upsert: true }
    ];
    return this.db.collection('appdata').updateOne(...updateQuery);
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
        .then(() => db.collection('appdata').findOne({ lobbyId: ctx.lobby._id, name: name }))
        .then(appdata => {
          if (appdata === null) {
            appdata = {
              store: defaultStore,
              lobbyId: ctx.lobby._id,
              name: name,
              exclusive: exclusive
            };
          }
          return appHandler(action, new AppContext(null, ws, db, ctx.lobby, appdata, exclusive))
        });
    }
  });
  return sapiHandlers;
}


module.exports = app2sapi;
