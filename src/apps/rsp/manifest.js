const STAGE = {
  NOT_INITIALIZED: "not_initialized",
  COMPLETE: "complete",
  ONGOING: "ongoing",
}

const MOVE = {
  ROCK: 'rock',
  SCISSORS: 'scissors',
  PAPER: 'paper'
};

const RESULT = {
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  TIE: 'tie',
  UNKNOWN: 'unknown'
};

module.exports = {
  NAME: "RSP",
  EXCLUSIVE: true,
  HOT_JOIN: false,
  HOT_LEAVE: false,
  USERS_LIMIT: {
    MAX: 2,
    MIN: 2
  },

  DEFAULT_STORE: {
    roundLimit: 5,
    player1: {
      _id: null,
      points: 0,
      moves: []
    },
    player2: {
      _id: null,
      points: 0,
      moves: []
    },
    stage: STAGE.NOT_INITIALIZED
  },

  CONSTS: {
    STAGE: STAGE,
    ACTION: {
      RSP_MOVE: "RSP_MOVE"
    },
    MOVE: MOVE,
    RESULT: RESULT,
    DUEL_TABLE: {
      [MOVE.ROCK]: {
        [MOVE.ROCK]: RESULT.TIE,
        [MOVE.SCISSORS]: RESULT.VICTORY,
        [MOVE.PAPER]: RESULT.DEFEAT
      },
      [MOVE.SCISSORS]: {
        [MOVE.ROCK]: RESULT.DEFEAT,
        [MOVE.SCISSORS]: RESULT.TIE,
        [MOVE.PAPER]: RESULT.VICTORY
      },
      [MOVE.PAPER]: {
        [MOVE.ROCK]: RESULT.VICTORY,
        [MOVE.SCISSORS]: RESULT.DEFEAT,
        [MOVE.PAPER]: RESULT.TIE
      }
    }
  }
};
