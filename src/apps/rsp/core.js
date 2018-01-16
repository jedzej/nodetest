export const MOVE_ROCK = 'rock';
export const MOVE_SCISSORS = 'scissors';
export const MOVE_PAPER = 'paper';

export const MOVE = {
  ROCK:'rock',
  SCISSORS:'scissors',
  PAPER:'paper'
};

export const RESULT = {
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT',
  TIE: 'TIE',
  UNKNOWN: 'UNKNOWN',
};

const DUEL_TABLE = {
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
  [MOVE_PAPER]: {
    [MOVE.ROCK]: RESULT.VICTORY,
    [MOVE.SCISSORS]: RESULT.DEFEAT,
    [MOVE.PAPER]: RESULT.TIE
  }
};

export const rspRound = (moveA, moveB) => {
  try {
    return DUEL_TABLE[moveA][moveB]
  } catch (e) {
    return RESULT.UNKNOWN;
  }
}

export const rspMatch = (me, opponent, roundsLimit) => {
  const result = me.points - opponent.points;
  if (result > 0) {
    return RESULT.VICTORY;
  } else if (result < 0) {
    return RESULT.DEFEAT;
  } else {
    return RESULT.TIE;
  }
}