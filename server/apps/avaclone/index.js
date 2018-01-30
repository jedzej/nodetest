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

const countIf = (arr, cond) => arr.reduce((s, e) => cond(e) ? s : s + 1, 0);

const includesObjectId = (arr, objectId) => arr.some(id => objectId.equals(id));

const getPlayersCount = appContext => appContext.lobby.members.length;

const getCurrentQuest = store => Object.values(store.quest).find(
  quest => quest.stage === QUEST_STAGE.ONGOING);

const getQuestVoters = quest => Object.keys(quest.questVotes);

const getSquadVoters = quest => Object.keys(quest.squadVotes);

const calcSquadVotes = quest => countIf(Object.values(quest.squadVotes.votes), v => v);

const calcQuestFailVotes = quest => countIf(Object.values(quest.questVotes.votes), v => !v);

const getSquadCount = quest => Object.keys(quest.squad).length;

const getReqSquadCount = (appContext, quest) => QUEST_MAP[getPlayersCount(appContext)].squadCount[quest.number];

const getReqFailCount = (appContext, quest) => QUEST_MAP[getPlayersCount(appContext)].failsRequired[quest.number];

const isSquadFull = quest => getSquadCount(quest) === getReqSquadCount(quest);

const isSquadMember = (quest, user) => includesObjectId(quest.squad, user._id);

const hasVotedForSquad = (quest, user) => includesObjectId(
  getSquadVoters(quest), user._id);

const hasVotedForQuest = (quest, user) => includesObjectId(
  getQuestVoters(quest), user._id);

const allVotedForSquad = (appContext) =>
  (getCurrentQuest(guest).squadVotes.length === getPlayersCount(appContext));

const allVotedForQuest = (quest) =>
  (quest.questVotes.length === getSquadCount(quest));

const isLobbyLeader = appContext =>
  (appContext.lobby.leaderId !== appContext.currentUser._id);

const getCommanderId = store =>
  store.playersOrder[store.roundNumber % store.playersOrder.length];

const isCommander = appContext => appContext.currentUser._id.equals(
  getCommanderId(appContext.store));

const bumpRound = store => store.roundNumber++;

const inStage = (appContext, stage) => (appContext.store.stage === stage);

const notInStage = (appContext, stage) => (appContext.store.stage !== stage);

const squadVotingSuccess = (appContext, quest) =>
  (calcSquadVotes(quest) > getPlayersCount(appContext) / 2);

const squadVotingFailLimitExceeded = (store, quest) =>
  (quest.votingHistory.length >= store.configuration.squadVotingFailLimit)

const questVotingSuccess = (appContext, quest) =>
  (calcQuestFailVotes(quest) < getReqFailCount(appContext, quest));

const getFailQuestsCount = store => countIf(store.quest,
  q => q.stage === QUEST_STAGE.FAILURE);

const getSuccessQuestsCount = store => countIf(store.quest,
  q => q.stage === QUEST_STAGE.SUCCESS);

const completeConditionFulfilled = store =>
  (getSuccessQuestsCount(store) >= 3 || getFailQuestsCount(store) >= 3);



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
    if (isLobbyLeader(appContext) === false)
      return;
    if (notInStage(appContext, STAGE.CONFIGURATION))
      return;

    appContext.store.configuration = action.payload.configuration;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_START]: (action, appContext) => {
    if (isLobbyLeader(appContext) === false)
      throw new Error("Not a leader");
    if (notInStage(appContext, STAGE.CONFIGURATION))
      throw new Error("Invalid stage");

    const playersCount = getPlayersCount(appContext);
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
    shuffle(store.playersOrder);

    // set stage
    store.stage = STAGE.QUEST_SELECTION;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SELECT_QUEST]: (action, appContext) => {
    const store = appContext.store;
    if (inStage(appContext, STAGE.QUEST_SELECTION))
      throw new Error("Invalid stage");

    if (isCommander(appContext))
      throw new Error("Not a commander");

    const qNum = action.payload.questNumber;
    if (store.quest[qNum].stage !== QUEST_STAGE.NOT_TAKEN)
      throw new Error("Quest already taken");

    store.quest[qNum].stage = QUEST_STAGE.ONGOING;
    store.stage = STAGE.SQUAD_PROPOSAL;
    store.quest[qNum].squad = [];
    store.quest[qNum].squadVotes = {};
    store.quest[qNum].questVotes = {};
    store.quest[qNum].votingHistory = [];

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_PROPOSE]: (action, appContext) => {
    const store = appContext.store;
    if (inStage(appContext, STAGE.SQUAD_PROPOSAL))
      throw new Error("Invalid stage");

    if (isCommander(appContext))
      throw new Error("Not a commander");

    let quest = getCurrentQuest(store);
    quest.squad = action.payload;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_CONFIRM]: (action, appContext) => {
    const store = appContext.store;
    if (inStage(appContext, STAGE.SQUAD_PROPOSAL))
      throw new Error("Invalid stage");

    if (isCommander(appContext))
      throw new Error("Not a commander");

    let quest = getCurrentQuest(store);

    if (isSquadFull(quest) === false)
      throw new Error("Invalid quest squad count");

    store.stage = STAGE.SQUAD_PROPOSAL_VOTING;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_SQUAD_VOTE]: (action, appContext) => {
    const store = appContext.store;
    if (inStage(appContext, STAGE.SQUAD_PROPOSAL_VOTING))
      throw new Error("Invalid stage");

    const quest = getCurrentQuest(store);

    if (hasVotedForSquad(quest, appContext.currentUser))
      throw new Error("Already voted");

    quest.squadVotes[appContext.currentUser._id] = action.payload.vote;

    if (allVotedForSquad(appContext)) {
      // update voting history
      quest.votingHistory.push({
        squad: quest.squad,
        squadVotes: quest.squadVotes
      });
      if (squadVotingSuccess(appContext, quest)) {
        // squad accepted
        store.stage = STAGE.QUEST_VOTING;
      } else if (squadVotingFailLimitExceeded(store, quest)) {
        // limit reached, auto-failure
        store.roundNumber++;
        quest.stage = QUEST_STAGE.FAILURE;
        store.stage = STAGE.QUEST_SELECTION;
      } else {
        // squad denied
        store.roundNumber++;
        store.stage = STAGE.SQUAD_PROPOSAL;
      }
      // clean squad votes buffer
      quest.squadVotes = [];
    }

    if (completeConditionFulfilled(store)) {
      store.stage = STAGE.COMPLETE;
    }

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [ACTION.AVACLONE_QUEST_VOTE]: (action, appContext) => {
    const store = appContext.store;
    if (inStage(appContext, STAGE.QUEST_VOTING))
      throw new Error("Invalid stage");

    const quest = getCurrentQuest(store);

    if (isSquadMember(quest, appContext.currentUser))
      throw new Error("Not a squad member");
    if (hasVotedForQuest(quest, appContext.currentUser))
      throw new Error("Already voted");

    quest.questVotes[appContext.currentUser._id] = action.payload.vote;

    if (allVotedForQuest(quest)) {
      if (questVotingSuccess(appContext, quest)) {
        quest.stage = QUEST_STAGE.SUCCESS;
      } else {
        quest.stage = QUEST_STAGE.FAILURE;
      }
      store.roundNumber++;
      store.stage = STAGE.QUEST_SELECTION;
    }

    if (completeConditionFulfilled(store)) {
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
