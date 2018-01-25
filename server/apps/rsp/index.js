const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const check = require('../../modules/check');
const appService = require('../../modules/app/service');
const MANIFEST = require('../../../src/apps/rsp/manifest')
const rejectionAction = tools.rejectionAction

const { MOVE, DUEL_TABLE, RESULT, STAGE, ACTION } = MANIFEST.CONSTS;

var debug = require('debug')('rsp');
debug.log = console.log.bind(console);

const RSP_APP_HANDLERS = {

  'APP_START_HOOK': (action, appContext) => {
    if (action.payload.name !== MANIFEST.NAME)
      return;
    if (appContext.lobby.members.length != 2) {
      throw new Error("There must be 2 members in the lobby")
    }
    debug('Starting RSP app');
    const members = appContext.lobby.members;
    appContext.store.player1._id = members[0]._id;
    appContext.store.player2._id = members[1]._id;
    appContext.store.stage = STAGE.ONGOING;
    return appContext.commit();
  },

  'APP_TERMINATE_HOOK': (action, appContext) => {
    debug('terminate');
  },

  'LOBBY_JOIN_HOOK': (action, appContext) => {
    if (appContext.exists)
      throw new Error("No hot join allowed!")
  },

  'LOBBY_LEAVE_HOOK': (action, appContext) => {
    if (appContext.exists) {
      debug('Hot leave not allowed, terminating app!')
      return appContext.terminate()
        .then(() => appContext.doAppUpdate());
    }
  },

  'LOBBY_KICK_HOOK': (action, appContext) => {
    if (appContext.exists){
      debug('Hot leave not allowed, terminating app!')
      return appContext.terminate()
        .then(() => appContext.doAppUpdate());
    }
  },

  [ACTION.RSP_MOVE]: (action, appContext) => {
    var store = appContext.store;
    var m, o;
    switch (store.stage) {
      case STAGE.ONGOING:
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
          if (result === RESULT.VICTORY) {
            m.points++;
          } else if (result === RESULT.DEFEAT) {
            o.points++;
          }
          var roundsLeft = store.roundLimit - m.moves.length;
          if (Math.abs(m.points - o.points) > roundsLeft || roundsLeft == 0)
            store.stage = STAGE.COMPLETE
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
  manifest: MANIFEST
}
