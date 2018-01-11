import { RSP_START, RSP_MOVE, RSP_UPDATE_REQUEST, RSP_TERMINATE } from './types'

export const start = () => ({
  type: RSP_START
});

export const move = (variant) => ({
  type: RSP_MOVE,
  payload: variant
});

export const update = () => ({
  type: RSP_UPDATE_REQUEST
})

export const terminate = () => ({
  type: RSP_TERMINATE
})