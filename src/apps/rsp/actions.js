import MANIFEST from './manifest'
const type = MANIFEST.consts.action.type;

export const move = variant => ({
  type: type.RSP_MOVE,
  payload: variant
});
