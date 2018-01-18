const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const check = require('../../modules/check');
const appService = require('../../modules/app/service');
const MANIFEST = require('./manifest.json')
const rejectionAction = tools.rejectionAction

const MOVE_ROCK = 'rock';
const MOVE_SCISSORS = 'scissors';
const MOVE_PAPER = 'paper';

const VICTORY = new Object();
const DEFEAT = new Object();

const DUEL_TABLE = {
  [MOVE_ROCK]: {
    [MOVE_ROCK]: undefined,
    [MOVE_SCISSORS]: VICTORY,
    [MOVE_PAPER]: DEFEAT
  },
  [MOVE_SCISSORS]: {
    [MOVE_ROCK]: DEFEAT,
    [MOVE_SCISSORS]: undefined,
    [MOVE_PAPER]: VICTORY
  },
  [MOVE_PAPER]: {
    [MOVE_ROCK]: VICTORY,
    [MOVE_SCISSORS]: DEFEAT,
    [MOVE_PAPER]: undefined
  }
};

const RSP_APP_HOOKS = {

  'APP_TERMINATE_HOOK': appContext => {
    console.log('terminate');
  },

  'APP_START_HOOK': appContext => {
    if (appContext.lobby.members.length != 2) {
      throw new Error("There must be 2 members in the lobby")
    }
    const members = appContext.lobby.members;
    appContext.store.player1._id = members[0]._id;
    appContext.store.player2._id = members[1]._id;
    appContext.store.stage = "ongoing";
    return appContext.commit();
  }
}


const RSP_APP_HANDLERS = {

  'APP_START_HOOK': (action, appContext) => {
    if (appContext.lobby.members.length != 2) {
      throw new Error("There must be 2 members in the lobby")
    }
    const members = appContext.lobby.members;
    appContext.store.player1._id = members[0]._id;
    appContext.store.player2._id = members[1]._id;
    appContext.store.stage = "ongoing";
    return appContext.commit();
  },

  'APP_TERMINATE_HOOK': (action, appContext) => {
    console.log('terminate');
  },

  'LOBBY_JOIN_HOOK': (action, appContext) => {
    const appdata = action.payload.app;
    if (appdata && appdata.name === MANIFEST.name)
      throw new Error("No hot join allowed!")
  },

  'LOBBY_LEAVE_HOOK': (action, appContext) => {
    const appdata = action.payload.app;
    if (appdata && appdata.name === MANIFEST.name)
      return appContext.terminate()
        .then(() => appContext.doAppUpdate());
  },

  'LOBBY_KICK_HOOK': (action, appContext) => {
    const appdata = action.payload.app;
    if (appdata && appdata.name === MANIFEST.name)
      return appContext.terminate()
        .then(() => appContext.doAppUpdate());
  },

  'RSP_MOVE': (action, appContext) => {
    var store = appContext.store;
    var m, o;
    console.log(appContext.store)
    switch (store.stage) {
      case "ongoing":
        if (store.player1._id.equals(appContext.currentUser._id)) {
          m = store.player1;
          o = store.player2;
        } else {
          m = store.player2;
          o = store.player1;
        }
        if (m.moves.length - o.moves.length <= 0) {
          m.moves.push(action.payload);
        }
        if (m.moves.length == o.moves.length) {
          var result = DUEL_TABLE[m.moves.slice(-1)][o.moves.slice(-1)];
          if (result === VICTORY) {
            m.points++;
          } else if (result === DEFEAT) {
            o.points++;
          }
          var roundsLeft = store.roundLimit - m.moves.length;
          if (Math.abs(m.points - o.points) > roundsLeft || roundsLeft == 0)
            store.stage = "complete"
        }
        return appContext.commit()
          .then(() => appContext.doAppUpdate());
        break;
      default:
        throw new sapi.SapiError("Invalid stage!", "EINVSTAGE");
        break;
    }
  }
}

module.exports = {
  handlers: RSP_APP_HANDLERS,
  hooks: RSP_APP_HOOKS
}
