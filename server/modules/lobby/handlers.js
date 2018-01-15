var lobbyService = require('./service');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
var debug = require('debug')('lobby:handlers');
debug.log = console.log.bind(console);

const error = (msg, code) => new SapiError(msg, code);

const lobbyPayload = lobby => ({
  token: lobby ? lobby.token : null,
  leaderId: lobby ? lobby.leaderId : null,
  members: lobby ? lobby.members : null
});

const lobbyUpdateAction = lobby => ({
  type: "LOBBY_UPDATE",
  payload: lobbyPayload(lobby)
})

const lobbyRejectAction = (type, err) => ({
  type: type,
  payload: SapiError.from(err, err.code).toPayload()
});

const verify = {
  loggedIn: ws => tools.verify(ws.store.currentUser, error("Not logged in", "EAUTH")),
  notLoggedIn: ws => tools.verify(ws.store.currentUser, error("Already logged in", "EAUTH")),
  inLobby: ws => tools.verify(ws.store.currentUser, error("Not in lobby", "EAUTH")),
  notInLobby: ws => tools.verify(ws.store.currentUser, error("Already in lobby", "EAUTH")),
  isLeader: (ws, lobby) => tools.verify(ws.store.currentUser._id.equals(lobby.leaderId), error("Not a leader", "EAUTH"))
}

const dbgAndGo = msg => data => {
  debug(msg, data);
  return data;
}



const handlers = {

  'LOBBY_UPDATE_REQUEST': (action, ws, db) => {
    var context = new tools.Context();

    var lobbyPromise;
    if (ws.store.lobbyId)
      lobbyPromise = lobbyService.get.byId(db, ws.store.lobbyId)
    else if (ws.store.currentUser)
      lobbyPromise = lobbyService.get.byMemberId(db, ws.store.currentUser._id);
    else
      lobbyPromise = Promise.reject("No active session!", "EAUTH");

    return lobbyPromise
      .then(lobby => lobbyService.get.withMembers(db, lobby))
      .then(context.store('lobby'))
      .then(() => ws.sendAction(lobbyUpdateAction(context.lobby)))
      .catch(err => {
        console.log("ERRR",err)
        ws.sendAction(lobbyRejectAction("LOBBY_UPDATE_REJECTED", err));
        throw err;
      });
  },

  'LOBBY_CREATE': (action, ws, db) => {
    // verify input
    return Promise.resolve()
      .then(verify.loggedIn(ws))
      .then(verify.notInLobby(ws))
      // acutally create the lobby
      .then(() => lobbyService.create(db, ws.store.currentUser))
      // store handle and respond
      .then(lobby => {
        ws.store.lobbyId = lobby._id;
        ws.sendAction("LOBBY_CREATE_FULFILLED");
        ws.sendAction(lobbyUpdateAction(lobby));
      })
      // error handling
      .catch(err => {
        ws.sendAction(lobbyRejectAction("LOBBY_CREATE_REJECTED", err));
        throw err;
      });
  },


  'LOBBY_LIST': (action, ws, db) => {
    return lobbyService.get.list(db)
      .then(lobbies => {
        ws.sendAction("LOBBY_LIST_FULFILLED", lobbies.map(lobbyPayload));
      })
      // error handling
      .catch(err => {
        ws.sendAction(lobbyRejectAction("LOBBY_LIST_REJECTED", err));
        throw err;
      })
  },


  'LOBBY_JOIN': (action, ws, db) => {
    // verify input
    return Promise.resolve()
      .then(verify.loggedIn(ws))
      .then(verify.notInLobby(ws))
      // actually join the lobby
      .then(() => lobbyService.join(db, ws.store.currentUser._id, action.payload.token))
      .then(lobby => lobbyService.get.byToken(db, action.payload.token))
      // store handle and respond
      .then(lobby => {
        ws.store.lobbyId = lobby._id;
        ws.sendAction("LOBBY_JOIN_FULFILLED");
        return lobby;
      })
      // error handling
      .catch(err => {
        ws.sendAction(lobbyRejectAction("LOBBY_JOIN_REJECTED", err));
        throw err;
      })
      // update all members
      .then(lobby => lobbyService.get.withMembers(db, lobby))
      .then(lobby => {
        console.log('update all', lobby, sapi.getClients(tools.filterByLobby(lobby)), lobby)
        sapi.getClients(tools.filterByLobby(lobby)).forEach(wsClient => {
          console.log('updating')
          wsClient.sendAction(lobbyUpdateAction(lobby));
        });
      });
  },

  'LOBBY_KICK': (action, ws, db) => {
    var context = new tools.Context();
    // verify input
    return Promise.resolve()
      .then(verify.loggedIn(ws))
      .then(verify.inLobby(ws))
      .then(tools.verify(action.payload.id, error("Invalid action payload", "EINVACTION")))
      // get current user's lobby
      .then(() => lobbyService.get.byMemberId(db, ws.store.currentUser._id))
      .then(context.store('lobby'))
      // verify if leader is kicking
      .then(data => verify.isLeader(ws, context.lobby)(data))
      .then(dbgAndGo([context.lobby, action.payload]))
      // get kicked user
      .then(() => context.lobby.membersIds.find(id => id.equals(action.payload.id)))
      .then(context.store('kickedUserId'))
      .then(tools.verify(() => context.kickedUserId, error("User not in lobby", "EAUTH")))
      // remove kicked user from lobby
      .then(() => lobbyService.leave(db, context.kickedUserId))
      // store handle and respond
      .then(result => {
        debug('User kicked')
        sapi.getClients(client => client.store.currentUser && client.store.currentUser._id.equals(action.payload.id)).forEach(client => {
          delete client.store.lobbyId;
          client.sendAction("LOBBY_KICKED");
        })
        ws.sendAction("LOBBY_KICK_FULFILLED");
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
      .then(() => lobbyService.get.byIdWithMembers(db, context.lobby._id))
      .then(lobby => {
        sapi.getClients(tools.filterByLobby(lobby)).forEach(wsClient => {
          wsClient.sendAction(lobbyUpdateAction(lobby));
        });
      });
  },

  'LOBBY_LEAVE': (action, ws, db) => {
    var context = new tools.Context();
    // verify input
    return Promise.resolve()
      .then(verify.loggedIn(ws))
      .then(verify.inLobby(ws))
      // acually leave the lobby
      .then(() => lobbyService.leave(db, ws.store.currentUser._id))
      // delete handle and respond
      .then(() => {
        context.lobbyId = ws.store.lobbyId;
        delete ws.store.lobbyId;
        ws.sendAction("LOBBY_LEAVE_FULFILLED");
        ws.sendAction(lobbyUpdateAction(null));
      })
      // error handling
      .catch(err => {
        ws.sendAction(lobbyRejectAction("LOBBY_LEAVE_REJECTED", err));
        throw err;
      })
      // update all lobby members
      .then(() => lobbyService.get.byIdWithMembers(db, context.lobbyId))
      .then(lobby => {
        sapi.getClients(tools.filterByLobby(lobby)).forEach(wsClient => {
          wsClient.sendAction(lobbyUpdateAction(lobby));
        });
      });
  },
}

module.exports = handlers;
