import { CHAT_MESSAGE } from './types'

export const message = (msg) => ({
  type: CHAT_MESSAGE,
  payload: {
    message:msg
  }
});
