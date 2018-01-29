const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const check = require('../../modules/check');
const appService = require('../../modules/app/service');
const MANIFEST = require('../../../src/apps/avaclone/manifest')
const rejectionAction = tools.rejectionAction

const { STAGE, CHAR, ACTION, TEAM, QUEST_STAGE, QUEST_MAP } = MANIFEST.CONSTS;

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




const AVACLONE_APP_HANDLERS = {


  'APP_START_HOOK': (action, appContext) => {
    if (action.payload.name !== MANIFEST.NAME)
      return;

    appContext.store.stage = STAGE.CONFIGURATION;

    appContext.store.users = members.reduce((map, member) => {
      map[member._id] = createUser(appContext, member);
      return map;
    }, {});
    return appContext.commit();
  },


  'APP_TERMINATE_HOOK': (action, appContext) => {
    console.log('PAINT TERMINATE', appContext.exists);
  },


  'LOBBY_JOIN_HOOK': (action, appContext) => {
    console.log('PAINT JOIN', appContext.exists);
    const { store, currentUser } = appContext;
    if (store.users[currentUser._id] === undefined) {
      store.users[currentUser._id] = createUser(appContext, currentUser);
      appContext.commit()
        .then(() => appContext.doAppUpdate());
    }
  },


  'LOBBY_LEAVE_HOOK': (action, appContext) => {
    console.log('PAINT LEAVE', appContext.exists);
  },


  'LOBBY_KICK_HOOK': (action, appContext) => {
    console.log('PAINT KICK', appContext.exists);
  },


  [ACTION.AVACLONE_CONFIGURE]: (action, appContext) => {
    if (appContext.lobby.leaderId !== appContext.currentUser._id)
      return;
    if (appContext.store.stage !== STAGE.CONFIGURATION)
      return;

    appContext.store.configuration = action.payload.configuration;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_START]: (action, appContext) => {
    if (appContext.store.stage !== STAGE.CONFIGURATION)
      throw new Error("Invalid stage");
    if (appContext.lobby.leaderId.equals(appContext.currentUser._id))
      throw new Error("Not a leader");

    const playersCount = appContext.lobby.members.length;
    const loyalityMap = LOYALITY_MAP[playersCount];

    if (playersCount < 5 || playersCount > 10)
      throw new Error("There must be 5 to 10 members in the lobby");

    const store = appContext.store;

    // create characters pool
    const goodPool = store.configuration.specialChars.filter(
      char => TEAM.GOOD.includes(char)
    );
    const evilPool = store.configuration.specialChars.filter(
      char => TEAM.GOOD.includes(char)
    );

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
    shuffle(playersOrder);

    // set stage
    store.stage = STAGE.QUEST_SELECTION;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SELECT_QUEST]: (action, appContext) => {
    const store = appContext.store;
    if (store.stage !== STAGE.QUEST_SELECTION)
      throw new Error("Invalid stage");

    const order = store.playersOrder;
    const commanderId = order[store.roundNumber % order.length];

    if (commanderId.equals(appContext.currentUser._id))
      throw new Error("Not a commander");

    const qNum = action.payload.questNumber;
    if (store.quest[qNum].stage !== QUEST_STAGE.NOT_TAKEN)
      throw new Error("Quest already taken");

    store.quest[qNum].stage = QUEST_STAGE.ONGOING;
    store.stage = STAGE.SQUAD_PROPOSAL;
    store.quest[qNum].squad = [];
    store.quest[qNum].squadVotes = [];
    store.quest[qNum].questVotes = [];

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_PROPOSE]: (action, appContext) => {
    const store = appContext.store;
    if (store.stage !== STAGE.SQUAD_PROPOSAL)
      throw new Error("Invalid stage");

    const order = store.playersOrder;
    const commanderId = order[store.roundNumber % order.length];
    if (commanderId.equals(appContext.currentUser._id))
      throw new Error("Not a commander");

    const qNum = action.payload.questNumber;
    store.quest[qNum].squad = action.payload;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_CONFIRM]: (action, appContext) => {
    const store = appContext.store;
    if (store.stage !== STAGE.SQUAD_PROPOSAL)
      throw new Error("Invalid stage");

    const order = store.playersOrder;
    const commanderId = order[store.roundNumber % order.length];
    if (commanderId.equals(appContext.currentUser._id))
      throw new Error("Not a commander");

    if (commanderId.equals(appContext.currentUser._id))
      throw new Error("Not a commander");

    const qNum = action.payload.questNumber;
    const playersCount = appContext.lobby.members.length;
    const squadCount = store.quest[qNum].squad.length;
    const requiredSquadCount = QUEST_MAP[playersCount].squadCount[qNum];

    if(squadCount !== requiredSquadCount)
      throw new Error("Required " + squadCount + " players for this mission!");

    store.quest[qNum].squad = action.payload;

    QUEST_MAP[qNum].

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },

}

module.exports = {
  handlers: AVACLONE_APP_HANDLERS,
  manifest: MANIFEST
}
