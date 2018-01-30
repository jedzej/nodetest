const MANIFEST = require('./manifest');

const { QUEST_STAGE, QUEST_MAP } = MANIFEST.CONSTS;

const countIf = (arr, cond) => arr.reduce((s, e) => cond(e) ? s : s + 1, 0);

const vals = Object.values;
const keys = Object.keys;

const clone = (obj) => {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
    return obj;
  if (obj instanceof Date) {
    let temp = new obj.constructor();
  } else {
    let temp = obj.constructor();
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }
  return temp;
}

const idsEqual = (id1, id2) => id1.toString() === id2.toString();

const ac = {

  get: {
    default: () => MANIFEST.DEFAULT_STORE,
    currentQuest: store => vals(store.quest).find(
      quest => quest.stage === QUEST_STAGE.ONGOING),
    squadVoters: quest => vals(quest.squadVotes),
    playersCount: store => store.playersOrder.length,
    squadCount: quest => keys(quest.squad).length,
    squadCountRequired: (store, quest) =>
      QUEST_MAP[ac.get.playersCount(store)].squadCount[quest.number],
    failureCountRequired: (store, quest) =>
      QUEST_MAP[ac.get.playersCount(store)].failsRequired[quest.number],
  },

  sum: {
    successSquadVotes: quest => countIf(vals(quest.squadVotes), v => v === true),
    failureSquadVotes: quest => countIf(vals(quest.squadVotes), v => v === false),
    successQuestVotes: quest => countIf(vals(quest.questVotes), v => v === true),
    failureQuestVotes: quest => countIf(vals(quest.questVotes), v => v === false),
    failedQuests: store =>
      countIf(store.quest, q => q.stage === QUEST_STAGE.SUCCESS),
    succeededQuests: store =>
      countIf(store.quest, q => q.stage === QUEST_STAGE.FAILURE),
  },

  is: {
    inStage: (entity, stage) => (entity.stage === stage),
    notInStage: (entity, stage) => (entity.stage !== stage),
    squadMember: (quest, userId) =>
      (quest.squad.some(id => idsEqual(id, userId))),
    squadFull: (store, quest) =>
      (ac.get.squadCount(quest) === ac.get.squadCountRequired(store, quest)),
    commander: (store, userId) =>
      idsEqual(
        store.playersOrder[store.roundNumber % store.playersOrder.length],
        userId
      ),
    completeConditionFulfilled: store =>
      (ac.sum.failedQuests(store) >= 3 || ac.sum.succeededQuests(store) >= 3),

    squadVoting: {
      doneFor: (quest, userId) =>
        ac.get.squadVoters(quest).find(voterId => idsEqual(voterId, userId)),
      done: (store, quest) =>
        (quest.squadVotes.length === ac.get.playersCount(store)),
      success: (store, quest) =>
        (ac.sum.successQuestVotes(quest) > ac.get.playersCount(store) / 2),
      failure: (store, quest) =>
        (ac.is.squadVoting.success(store, quest) === false),
      limitExceeded: (store, quest) =>
        (quest.votingHistory.length >= store.configuration.squadVotingLimit),
    },

    questVoting: {
      doneFor: (quest, userId) =>
        ac.get.questVoters(quest).find(voterId => idsEqual(voterId, userId)),
      done: (store, quest) =>
        (quest.questVotes.length === ac.get.squadCountRequired(store, quest)),
      success: (store, quest) =>
        (ac.sum.failureQuestVotes(quest) < ac.get.failureCountRequired(store, quest)),
      failure: (store, quest) =>
        (ac.is.questVoting.success(store, quest) === false),
    },
  },
  completeConditionFulfilled: store =>
    (getSuccessQuestsCount(store) >= 3 || getFailQuestsCount(store) >= 3),

}

module.exports = ac;