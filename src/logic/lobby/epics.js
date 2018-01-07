import { ofType, combineEpics } from 'redux-observable';
import { mapTo } from 'rxjs/operators';
import { webSocketWrite } from 'webSocketMiddleware'
import {
  LOBBY_CREATE,
  LOBBY_LIST,
  LOBBY_LEAVE,
  LOBBY_JOIN,
  LOBBY_UPDATE_REQUEST,
  LOBBY_UPDATE_REJECTED,
  LOBBY_LEAVE_FULFILLED,
  LOBBY_JOIN_REJECTED,
  LOBBY_LEAVE_REJECTED,
  LOBBY_CREATE_REJECTED } from './types'
import { USER_UPDATE, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED } from '../user/types'
import { update, list } from './actions'

const lobbyEpic = action$ =>
  action$.pipe(
    ofType(LOBBY_CREATE,
      LOBBY_LIST,
      LOBBY_LEAVE,
      LOBBY_JOIN,
      LOBBY_UPDATE_REQUEST),
    webSocketWrite
  );


const updateTriggersEpic = action$ =>
  action$.pipe(
    ofType(
      USER_UPDATE,
      LOBBY_LEAVE_REJECTED,
      LOBBY_CREATE_REJECTED,
      LOBBY_JOIN_REJECTED
    ),
    mapTo(update())
  );

const listTriggersEpic = action$ =>
  action$.pipe(
    ofType(
      LOBBY_UPDATE_REJECTED,
      LOBBY_LEAVE_FULFILLED,
      LOBBY_JOIN_REJECTED,
    ),
    mapTo(list())
  );

export default combineEpics(
  lobbyEpic,
  updateTriggersEpic,
  listTriggersEpic
);