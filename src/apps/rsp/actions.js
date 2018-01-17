import { RSP_START, RSP_MOVE } from './types'

export const start = () => ({
  type: RSP_START
});

export const move = (variant) => ({
  type: RSP_MOVE,
  payload: variant
});
