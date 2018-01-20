const stage = {
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
  name: "RSP",
  exclusive: true,
  hotJoin: false,
  hotLeave: false,
  usersLimit: {
    max: 2,
    min: 2
  },
  defaultStore: {
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
    stage: stage.NOT_INITIALIZED
  },

  consts: {
    stage: stage,
    action: {
      type: {
        RSP_MOVE: "RSP_MOVE"
      }
    },
    MOVE: MOVE,
    RESULT: RESULT,
    DUEL_TABLE : {
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
