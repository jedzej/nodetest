const app2sapi = require('../../app2sapi');
const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const appService = require('../../modules/app/service');
const DEFAULT_STATE = require('../../../src/apps/rsp/default.json')
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


const requireLeader = appContext => {
  return appContext.lobby.leaderId.equals(appContext.currentUser._id) ?
    Promise.resolve() : Promise.reject("Not a leader");
}

const updateAll = appContext =>
  appContext.forSapiClients(ws => {
    ws.sendAction({
      type: "RSP_UPDATE",
      payload: appContext.appstore
    });
  })

const handlers = {

  'RSP_UPDATE_REQUEST': (action, appContext) => {
    appContext.forSapiClients(ws => {
      ws.sendAction("RSP_UPDATE", appContext.appstore);
    });
  },

  'RSP_START': (action, appContext) => {
    return requireLeader(appContext)
      .then(tools.verify(appContext.lobby.members.length == 2,
        new Error("There must be 2 members in the lobby")))
      .then(() => {
        const members = appContext.lobby.members;
        appContext.appstore.player1._id = members[0]._id;
        appContext.appstore.player2._id = members[1]._id;
        appContext.appstore.stage = "ongoing";
        return appContext.commit()
      })

      .then(() => {
        appContext.sapi.me.sendAction("RSP_START_FULFILLED");
        appContext.forSapiClients(ws => {
          ws.sendAction("RSP_UPDATE", appContext.appstore);
        });
        console.log(appContext)
      })
      .then(() => appContext.doAppUpdate())
      .catch(err => {
        console.log(err)
        appContext.sapi.me.sendAction(rejectionAction("RSP_START_REJECTED", err));
      });
  },

  'RSP_MOVE': (action, appContext) => {
    var store = appContext.appstore;
    var me, opponent;
    switch (store.stage) {
      case "ongoing":
        console.log(store)
        console.log(store.player1._id, appContext.currentUser._id)
        if (store.player1._id.equals(appContext.currentUser._id)) {
          me = store.player1;
          opponent = store.player2;
        } else {
          me = store.player2;
          opponent = store.player1;
        }
        if (me.moves.length - opponent.moves.length <= 0) {
          me.moves.push(action.payload);
        }
        if (me.moves.length == opponent.moves.length) {
          var result = DUEL_TABLE[me.moves.slice(-1)][opponent.moves.slice(-1)];
          if (result === VICTORY) {
            me.points++;
          } else if (result === DEFEAT) {
            opponent.points++;
          }
          var roundsLeft = store.roundLimit - me.moves.length;
          if (Math.abs(me.points - opponent.points) > roundsLeft || roundsLeft == 0)
            store.stage = "complete"
        }
        return appContext.commit()
          .then(() => {
            appContext.forSapiClients(ws => {
              ws.sendAction({
                type: "RSP_UPDATE",
                payload: appContext.appstore
              });
            });
          });
        break;
      default:
        throw new sapi.SapiError("Invalid stage!", "EINVSTAGE");
        break;
    }
  },

  'RSP_TERMINATE': (action, appContext) => {
    return requireLeader(appContext)
      .then(tools.verify(
        appContext.appstore.stage == "complete",
        new sapi.SapiError("Invalid stage!", "EINVSTAGE")))
      .then(() => appContext.terminate())
      .then(() => {
        appContext.sapi.me.sendAction("RSP_TERMINATE_FULFILLED")
      })
      .then(() => appContext.doAppUpdate())
      .catch(err => {
        appContext.sapi.me.sendAction(rejectionAction("RSP_TERMINATE_REJECTED", err));
        throw err;
      });
  }
}

module.exports = app2sapi(handlers, "rsp", DEFAULT_STATE, true);
