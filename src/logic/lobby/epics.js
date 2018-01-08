import { ofType, combineEpics } from 'redux-observable';
import { mapTo, map, tap, filter, ignoreElements, pairwise } from 'rxjs/operators';
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
  LOBBY_CREATE_REJECTED,
  LOBBY_CREATE_FULFILLED,
  LOBBY_JOIN_FULFILLED,
  LOBBY_UPDATE
} from './types'
import { USER_UPDATE } from '../user/types'
import { update, list } from './actions'
import { simpleNotificationSuccess, simpleNotificationError, simpleNotificationInfoAction } from '../common/operators'


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



const lobbyNotificationsEpics = [
  action$ =>
    action$.pipe(
      ofType(LOBBY_UPDATE),
      tap(action => console.log("EPIC", action)),
      ignoreElements()
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_CREATE_FULFILLED),
      simpleNotificationSuccess("Lobby created!")
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_CREATE_REJECTED),
      simpleNotificationError('Lobby create rejected!')
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_JOIN_FULFILLED),
      simpleNotificationSuccess("Lobby joined!")
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_JOIN_REJECTED),
      simpleNotificationError('Lobby join rejected!')
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_LEAVE_FULFILLED),
      simpleNotificationSuccess('Lobby left!')
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_LEAVE_REJECTED),
      simpleNotificationError('Lobby leave rejected!')
    ),
  action$ =>
    action$.pipe(
      ofType(LOBBY_UPDATE),
      map(action => action.payload.members || []),
      pairwise(),
      filter(mPair =>
        mPair[0].length > 0 &&
        mPair[1].length > 0 &&
        mPair[0].length !== mPair[1].length),
      map(mPair => mPair[1].length > mPair[0].length ? "Someone joined!" : "Someone left!"),
      map(message => simpleNotificationInfoAction(message))
    )
]


export default combineEpics(
  lobbyEpic,
  updateTriggersEpic,
  listTriggersEpic,
  ...lobbyNotificationsEpics
);