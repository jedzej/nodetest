import MANIFEST from './manifest'

const R = MANIFEST.CONSTS.RESULT;
const DT = MANIFEST.CONSTS.DUEL_TABLE;


export const rspRound = (moveA, moveB) => {
  try {
    return DT[moveA][moveB]
  } catch (e) {
    return R.UNKNOWN;
  }
}

export const rspMatch = (me, opponent, roundsLimit) => {
  const result = me.points - opponent.points;
  if (result > 0) {
    return R.VICTORY;
  } else if (result < 0) {
    return R.DEFEAT;
  } else {
    return R.TIE;
  }
}