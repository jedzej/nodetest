import MANIFEST from './manifest'
const {ACTION} = MANIFEST.CONSTS;

export const move = variant => ({
  type: ACTION.RSP_MOVE,
  payload: variant
});
