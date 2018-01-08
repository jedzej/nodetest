import { CHAT_MESSAGE, CHAT_TRUNCATE } from './types'

export const message = (msg) => ({
  type: CHAT_MESSAGE,
  payload: {
    message:msg
  }
});

export const truncate = () => ({
  type: CHAT_TRUNCATE
});
