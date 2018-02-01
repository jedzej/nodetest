const _ = require('lodash');
const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const check = require('../../modules/check');
const appService = require('../../modules/app/service');
const MANIFEST = require('../../../src/apps/avaclone/manifest');
const ac = require('../../../src/apps/avaclone/acutils');
const rejectionAction = tools.rejectionAction

const { STAGE, CHAR, ACTION, TEAM, QUEST_STAGE, QUEST_MAP, LOYALITY_MAP } = MANIFEST.CONSTS;

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
function clone(obj) {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
    return obj;
  if (obj instanceof Date) {
    let copy = new obj.constructor();
  } else {
    let copy = obj.constructor();
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      copy[key] = clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }
  return copy;
}

const isLobbyLeader = (appContext) => appContext.currentUser._id.equals(
  appContext.lobby.leaderId
);


const AVACLONE_APP_HANDLERS = {


  'APP_START_HOOK': (action, appContext) => {
    if (action.payload.name !== MANIFEST.NAME)
      return;

    appContext.store.stage = STAGE.CONFIGURATION;

    return appContext.commit();
  },


  'APP_TERMINATE_HOOK': (action, appContext) => {
    console.log('AVACLONE TERMINATE', appContext.exists);
  },


  'LOBBY_JOIN_HOOK': (action, appContext) => {

    const { store } = appContext;
    console.log("AVACLONE JOIN")
    if (ac.is.notInStage(store, STAGE.CONFIGURATION))
      throw new Error("Cannot join after the game was started");
  },


  'LOBBY_LEAVE_HOOK': (action, appContext) => {
    console.log('AVACLONE LEAVE', appContext.exists);
  },


  'LOBBY_KICK_HOOK': (action, appContext) => {
    console.log('AVACLONE KICK', appContext.exists);
  },


  [ACTION.AVACLONE_CONFIGURE]: (action, appContext) => {
    const { store } = appContext;
    if (isLobbyLeader(appContext) === false ||
      ac.is.notInStage(store, STAGE.CONFIGURATION)
    ) {
      appContext.sapi.me.sendAction(ACTION.AVACLONE_CONFIGURE_REJECTED);
      return;
    }

    appContext.store.configuration = action.payload.configuration;
    return appContext.commit()
      .then(() => {
        appContext.sapi.me.sendAction(ACTION.AVACLONE_CONFIGURE_FULFILLED);
        appContext.doAppUpdate()
      });
  },


  [ACTION.AVACLONE_START]: (action, appContext) => {
    const { store } = appContext;
    if (isLobbyLeader(appContext) === false)
      throw new Error("Not a leader");
    if (ac.is.notInStage(store, STAGE.CONFIGURATION))
      throw new Error("Invalid stage");

    const playersCount = appContext.lobby.members.length;
    const loyalityMap = LOYALITY_MAP[playersCount];

    if (playersCount < 5 || playersCount > 10)
      throw new Error("There must be 5 to 10 members in the lobby");

    // create characters pool
    const goodPool = [];
    const evilPool = [];
    _.forIn(store.configuration.specialChars, (present, char) => {
      if (present) {
        if (TEAM.GOOD.includes(char))
          goodPool.push(char);
        else
          evilPool.push(char);
      }
    });

    if (goodPool.length > loyalityMap.good)
      throw new Error("To many good special characters");
    if (evilPool.length > loyalityMap.evil)
      throw new Error("To many evil special characters");

    while (goodPool.length < loyalityMap.good)
      goodPool.push(CHAR.GOOD);
    while (evilPool.length < loyalityMap.evil)
      evilPool.push(CHAR.EVIL);

    let charPool = [...goodPool, ...evilPool];
    shuffle(charPool);

    // assign characters to players
    const members = appContext.lobby.members;
    store.charactersMap = members.reduce((map, member) => {
      map[member._id] = charPool.pop();
      return map;
    }, {});

    // set players order
    store.playersOrder = members.map(m => m._id);
    shuffle(store.playersOrder);

    // set stage
    store.stage = STAGE.QUEST_SELECTION;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_QUEST_SELECT]: (action, appContext) => {
    const { store, currentUser } = appContext;
    if (ac.is.notInStage(store, STAGE.QUEST_SELECTION))
      throw new Error("Invalid stage");
    if (ac.is.commander(store, currentUser._id) === false)
      throw new Error("Not a commander");

    const quest = store.quests[action.payload.questNumber];
    if (ac.is.notInStage(quest, QUEST_STAGE.NOT_TAKEN))
      throw new Error("Quest already taken");
    store.stage = STAGE.SQUAD_PROPOSAL;

    quest.stage = QUEST_STAGE.ONGOING;
    quest.squad = [];
    quest.squadVotes = {};
    quest.questVotes = {};
    quest.votingHistory = [];

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_PROPOSE]: (action, appContext) => {
    const { store, currentUser } = appContext;
    if (ac.is.notInStage(store, STAGE.SQUAD_PROPOSAL))
      throw new Error("Invalid stage");
    if (ac.is.commander(store, currentUser._id) === false)
      throw new Error("Not a commander");

    let quest = ac.get.currentQuest(store);
    quest.squad = action.payload.squad;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_CONFIRM]: (action, appContext) => {
    const { store, currentUser } = appContext;
    if (ac.is.notInStage(store, STAGE.SQUAD_PROPOSAL))
      throw new Error("Invalid stage");
    if (ac.is.commander(store, currentUser._id) === false)
      throw new Error("Not a commander");

    let quest = ac.get.currentQuest(store);

    if (ac.is.squadFull(store, quest) === false)
      throw new Error("Invalid quest squad count");

    store.stage = STAGE.SQUAD_VOTING;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_VOTE]: (action, appContext) => {
    const { store, currentUser } = appContext;
    if (ac.is.notInStage(store, STAGE.SQUAD_VOTING))
      throw new Error("Invalid stage");

    const quest = ac.get.currentQuest(store);

    if (ac.is.squadVoting.doneFor(quest, currentUser._id))
      throw new Error("Already voted");

    quest.squadVotes[currentUser._id] = action.payload.vote;

    if (ac.is.squadVoting.done(store, quest)) {
      // update voting history
      quest.votingHistory.push({
        squad: quest.squad,
        squadVotes: quest.squadVotes
      });
      if (ac.is.squadVoting.success(store, quest)) {
        // squad accepted
        store.stage = STAGE.QUEST_VOTING;
      } else if (ac.is.squadVoting.limitExceeded(store, quest)) {
        // limit reached, auto-failure
        quest.stage = QUEST_STAGE.FAILURE;
        store.roundNumber++;
        store.stage = STAGE.QUEST_SELECTION;
      } else {
        // squad denied
        store.roundNumber++;
        store.stage = STAGE.SQUAD_PROPOSAL;
      }
      // clean squad votes buffer
      quest.squadVotes = [];
    }

    if (ac.is.completeConditionFulfilled(store)) {
      store.stage = STAGE.COMPLETE;
    }

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_QUEST_VOTE]: (action, appContext) => {
    const { store, currentUser } = appContext;
    if (ac.is.notInStage(store, STAGE.QUEST_VOTING))
      throw new Error("Invalid stage");

    const quest = ac.get.currentQuest(store);

    if (ac.is.squadMember(quest, currentUser._id) === false)
      throw new Error("Not a squad member");
    if (ac.is.questVoting.doneFor(quest, currentUser._id))
      throw new Error("Already voted");

    quest.questVotes[currentUser._id] = action.payload.vote;

    if (ac.is.squadVoting.done(store, quest)) {
      if (ac.is.squadVoting.success(store, quest)) {
        quest.stage = QUEST_STAGE.SUCCESS;
      } else {
        quest.stage = QUEST_STAGE.FAILURE;
      }

      store.roundNumber++;
      store.stage = STAGE.QUEST_SELECTION;
    }

    if (ac.is.completeConditionFulfilled(store)) {
      store.stage = STAGE.COMPLETE;
    }

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },
};

module.exports = {
  handlers: AVACLONE_APP_HANDLERS,
  manifest: MANIFEST
};
