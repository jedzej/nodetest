import { LOBBY_CREATE, LOBBY_JOIN, LOBBY_LEAVE, LOBBY_LIST } from './types'

export const create = () => ({
  type: LOBBY_CREATE
});

export const join = (token) => ({
  type: LOBBY_CREATE,
  payload: { token }
});

export const leave = () => ({
  type: LOBBY_LEAVE
});

export const list = () => ({
  type: LOBBY_LEAVE
});
