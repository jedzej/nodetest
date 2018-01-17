import { RSP_MOVE } from './types'

export const move = (variant) => ({
  type: RSP_MOVE,
  payload: variant
});
