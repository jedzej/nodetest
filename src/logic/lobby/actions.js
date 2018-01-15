import { LOBBY_CREATE, LOBBY_JOIN, LOBBY_KICK, LOBBY_LEAVE, LOBBY_LIST, LOBBY_UPDATE_REQUEST } from './types'

export const create = () => ({
  type: LOBBY_CREATE
});

export const join = (token) => ({
  type: LOBBY_JOIN,
  payload: { token }
});

export const kick = (id) => ({
  type: LOBBY_KICK,
  payload: { id }
});

export const leave = () => ({
  type: LOBBY_LEAVE
});

export const list = () => ({
  type: LOBBY_LIST
});

export const update = () => ({
  type: LOBBY_UPDATE_REQUEST
});
