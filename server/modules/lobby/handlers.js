var lobbyService = require('./service');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
var debug = require('debug')('lobby:handlers');
debug.log = console.log.bind(console);

const lobbyPayload = lobby => ({
  token: lobby ? lobby.token : null,
  leaderId: lobby ? lobby.leaderId : null,
  members: lobby ? lobby.members : null
});

const lobbyUpdateAction = lobby => ({
  type: "LOBBY_UPDATE",
  payload: lobbyPayload(lobby)
})

const handlers = {

  'LOBBY_UPDATE_REQUEST': (action, ws, db) => {
    var context = new tools.Context();
    var lobbyPromise;
    if (ws.store.lobbyId)
      lobbyPromise = lobbyService.getBy(db, { _id: ws.store.lobbyId }, true)
    else if (ws.store.currentUser)
      lobbyPromise = lobbyService.getFor(db, ws.store.currentUser);
    else
      lobbyPromise = Promise.reject("No active session!", "EAUTH");
    return lobbyPromise
      .then(context.store('lobby'))
      .then(() => tools.verify(ws.store.lobbyId.equals(context.lobby._id), new SapiError("Not in lobby", "EAUTH"))())
      .then(() => {
        ws.sendAction(lobbyUpdateAction(context.lobby));
      })
      .catch(err => {
        ws.sendAction({
          type: "LOBBY_UPDATE_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      });
  },

  'LOBBY_CREATE': (action, ws, db) => {
    // verify input
    return tools.verify(ws.store.currentUser, new SapiError("Not logged in", "EAUTH"))()
      .then(tools.verify(ws.store.lobbyId == undefined, new SapiError("Already in a lobby", "ELOBBY")))
      // acutally create the lobby
      .then(() => lobbyService.create(db, ws.store.currentUser))
      // store handle and respond
      .then(lobby => {
        ws.store.lobbyId = lobby._id;
        ws.sendAction({
          type: "LOBBY_CREATE_FULFILLED"
        });
        ws.sendAction(lobbyUpdateAction(lobby));
      })
      // error handling
      .catch(err => {
        ws.sendAction({
          type: "LOBBY_CREATE_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      });
  },


  'LOBBY_LIST': (action, ws, db) => {
    return lobbyService.getList(db)
      .then(lobbies => {
        ws.sendAction({
          type: "LOBBY_LIST_FULFILLED",
          payload: lobbies.map(lobbyPayload)
        });
      })
      // error handling
      .catch(err => {
        ws.sendAction({
          type: "LOBBY_LIST_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      })
  },


  'LOBBY_JOIN': (action, ws, db) => {
    // verify input
    return tools.verify(ws.store.currentUser, new SapiError("Not logged in", "EAUTH"))()
      // actually join the lobby
      .then(() => lobbyService.join(db, ws.store.currentUser, action.payload.token))
      // store handle and respond
      .then(lobby => {
        ws.store.lobbyId = lobby._id;
        ws.sendAction({
          type: "LOBBY_JOIN_FULFILLED"
        });
        return Promise.resolve(lobby);
      })
      // error handling
      .catch(err => {
        ws.sendAction({
          type: "LOBBY_JOIN_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      })
      // update all members
      .then(lobby => {
        const wsClientsToUpdate = sapi.getClients(tools.filterByLobby(lobby));
        debug("Notifying %d clients", wsClientsToUpdate.length);
        for (var wsClient of wsClientsToUpdate) {
          debug("Notifying %s", wsClient.store);
          wsClient.sendAction(lobbyUpdateAction(lobby));
        }
      });
  },

  'LOBBY_KICK': (action, ws, db) => {
    var context = new tools.Context();
    debug('LOBBY KICK', ws.store.currentUser)
    // verify input
    return Promise.resolve()
      .then(tools.verify(ws.store.currentUser, new SapiError("Not logged in", "EAUTH")))
      // get current user's lobby
      .then(() => console.log('LOOOL'))
      .then(() => lobbyService.getFor(db, ws.store.currentUser))
      .then((lobby) => {
        debug('CONTEXT', lobby)
        return Promise.resolve(lobby);
      })
      .then(context.store('lobby'))
      .then(tools.verify(() => context.lobby, new SapiError("No lobby")))
      // verify if leader is kicking
      .then(tools.verify(() => context.lobby.leaderId.equals(ws.store.currentUser._id), new SapiError("Not a leader", "EAUTH")))
      // get kicked user
      .then(() => context.lobby.members.find(m => m.id.equals(action.payload.id)))
      .then(context.store('kickedUser'))
      .then(tools.verify(() => context.kickedUser, new SapiError("User not in lobby", "EAUTH")))
      // remove kicked user from lobby
      .then(() => lobbyService.leave(db, { _id: context.kickedUser.id }))
      // store handle and respond
      .then((lobby) => {
        debug('User kicked')
        ws.store.lobbyId = lobby._id;
        sapi.getClients(client => client.store.currentUser && client.store.currentUser._id.equals(action.payload.id)).forEach(client => {
          delete client.store.lobbyId;
          client.sendAction({ type: "LOBBY_KICKED" });
        })
        ws.sendAction({
          type: "LOBBY_KICK_FULFILLED"
        });
        return Promise.resolve(lobby);
      })
      // error handling
      .catch(err => {
        ws.sendAction({
          type: "LOBBY_KICK_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      })
      // update all members
      .then(lobby => {
        const wsClientsToUpdate = sapi.getClients(tools.filterByLobby(lobby));
        debug("Notifying %d clients", wsClientsToUpdate.length);
        for (var wsClient of wsClientsToUpdate) {
          debug("Notifying %s", wsClient.store);
          wsClient.sendAction(lobbyUpdateAction(lobby));
        }
      });
  },

  'LOBBY_LEAVE': (action, ws, db) => {
    // verify input
    return tools.verify(ws.store.currentUser, new SapiError("Not logged in", "EAUTH"))()
      .then(() => {
        console.log('AAA');
        debug(ws.store)
      })
      .then(tools.verify(ws.store.lobbyId, new SapiError("Not in lobby", "ELOBBY")))
      // acually leave the lobby
      .then(() => {
        return lobbyService.leave(db, ws.store.currentUser);
      })
      // delete handle and respond
      .then(lobby => {
        delete ws.store.lobbyId;
        ws.sendAction({
          type: "LOBBY_LEAVE_FULFILLED"
        });
        ws.sendAction(lobbyUpdateAction(null));
        return Promise.resolve(lobby);
      })
      // error handling
      .catch(err => {
        ws.sendAction({
          type: "LOBBY_LEAVE_REJECTED",
          payload: SapiError.from(err, err.code).toPayload()
        });
        throw err;
      })
      // update all lobby members
      .then(lobby => {
        const wsClientsToUpdate = sapi.getClients(tools.filterByLobby(lobby));
        debug("Notifying %d clients", wsClientsToUpdate.length);
        for (var wsClient of wsClientsToUpdate) {
          debug("Notifying %s", wsClient.store);
          wsClient.sendAction(lobbyUpdateAction(lobby));
        }
      });
  },
}

module.exports = handlers;
