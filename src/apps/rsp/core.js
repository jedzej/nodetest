export const MOVE_ROCK = 'rock';
export const MOVE_SCISSORS = 'scissors';
export const MOVE_PAPER = 'paper';

export const VICTORY = new Object();
export const DEFEAT = new Object();

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

export const rspMatch = (moveA, moveB) => {
  console.log(moveA, moveB)
  try {
    return DUEL_TABLE[moveA][moveB]
  } catch(e){
    return undefined;
  }
}