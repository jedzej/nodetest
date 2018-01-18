const lobbyService = require('./service');
const userService = require('../user/service');
const SapiError = require('../../sapi').SapiError;
const sapi = require('../../sapi');
const tools = require('../tools');
const check = require('../check');
const filter = require('../filter');
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


const dbgAndGo = msg => data => {
  debug(msg, data);
  return data;
}


const updateLobbyMembers = (db, lobbyId) =>
  lobbyService.get.byIdWithMembers(db, lobbyId)
    .then(lobby => {
      sapi.getClients(filter.ws.byLobbyId(lobby._id)).forEach(client => {
        client.sendAction(lobbyUpdateAction(lobby));
      });
    });


const handlers = {

  'LOBBY_UPDATE_REQUEST': (action, ws, db) => {
    var ctx = new tools.Context();

    var lobbyPromise;
    if (ws.store.lobbyId)
      lobbyPromise = lobbyService.get.byId(db, ws.store.lobbyId)
    else if (ws.store.currentUser)
      lobbyPromise = lobbyService.get.byMemberId(db, ws.store.currentUser._id);
    else
      lobbyPromise = Promise.reject("No active session!", "EAUTH");
    return lobbyPromise
      .then(lobby => lobbyService.get.withMembers(db, lobby))
      .then(ctx.store('lobby'))
      .then(() => ws.sendAction(lobbyUpdateAction(ctx.lobby)))
      .catch(err => {
        ws.sendAction(lobbyRejectAction("LOBBY_UPDATE_REJECTED", err));
        throw err;
      });
  },


  'LOBBY_CREATE': (action, ws, db) => {
    // check input
    return Promise.resolve()
      .then(check.loggedIn(ws))
      .then(check.notInLobby(ws))
      // acutally create the lobby
      .then(() => lobbyService.create(db, ws.store.currentUser))
      .then(lobby => lobbyService.get.withMembers(db, lobby))
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
    // check input
    return Promise.resolve()
      .then(check.loggedIn(ws))
      .then(check.notInLobby(ws))
      .then(() => app2sapi.fireHook(ws, db, {
        type: 'START',
        payload: action.payload.name
      }))
      // actually join the lobby
      .then(() =>
        lobbyService.join(db, ws.store.currentUser._id, action.payload.token)
      )
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
      .then(lobby => updateLobbyMembers(db, lobby._id))
  },


  'LOBBY_KICK': (action, ws, db) => {
    var ctx = new tools.Context();
    // check input
    return Promise.resolve()
      .then(check.loggedIn(ws))
      .then(check.inLobby(ws))
      .then(check
        .ifTrue(action.payload.id, "Invalid action payload", "EINVACTION")
      )
      // get current user's lobby
      .then(() => lobbyService.get.byMemberId(db, ws.store.currentUser._id))
      .then(ctx.store('lobby'))
      // check if leader is kicking
      .then(data => check.isLeader(ws, ctx.lobby)(data))
      // get kicked user
      .then(() => ctx.lobby.membersIds.find(id => id.equals(action.payload.id)))
      .then(ctx.store('kickedUserId'))
      .then(check.ifTrue(() => ctx.kickedUserId, "User not in lobby", "EAUTH"))
      // remove kicked user from lobby
      .then(() => lobbyService.leave(db, ctx.kickedUserId))
      // store handle and respond
      .then(result => {
        debug('User kicked')
        sapi.getClients(filter.ws.byId(action.payload.id)).forEach(client => {
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
      .then(() => updateLobbyMembers(db, ctx.lobby._id))
  },


  'LOBBY_LEAVE': (action, ws, db) => {
    var ctx = new tools.Context();
    // verify input
    return Promise.resolve()
      .then(check.loggedIn(ws))
      .then(check.inLobby(ws))
      // acually leave the lobby
      .then(() => lobbyService.leave(db, ws.store.currentUser._id))
      // delete handle and respond
      .then(() => {
        ctx.lobbyId = ws.store.lobbyId;
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
      .then(() => updateLobbyMembers(db, ctx.lobbyId))
  },
}

module.exports = handlers;
