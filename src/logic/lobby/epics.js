import { ofType, combineEpics } from 'redux-observable';
import { mapTo } from 'rxjs/operators';
import { webSocketWrite } from '../../webSocketMiddleware'
import lobbyNotificationsEpics from './notifications'
import Rx from 'rxjs/Rx';

import * as types from './types'
import { USER_UPDATE } from '../user/types'
import { update, list } from './actions'


const wsTransmitEpic = action$ =>
  action$.pipe(
    ofType(types.LOBBY_CREATE,
      types.LOBBY_LIST,
      types.LOBBY_LEAVE,
      types.LOBBY_JOIN,
      types.LOBBY_KICK,
      types.LOBBY_UPDATE_REQUEST),
    webSocketWrite
  );

const updateTriggersEpic = action$ =>
  action$.pipe(
    ofType(
      USER_UPDATE,
      types.LOBBY_LEAVE_REJECTED,
      types.LOBBY_CREATE_REJECTED,
      types.LOBBY_JOIN_REJECTED,
      types.LOBBY_KICKED
    ),
    mapTo(update())
  );

const listTriggersEpic = (action$, store) =>
  action$.ofType(
    types.LOBBY_UPDATE_REJECTED,
    types.LOBBY_LEAVE_FULFILLED,
    types.LOBBY_JOIN_REJECTED
  ).exhaustMap(_ =>
    Rx.Observable.interval(3000).startWith(1)
      .takeWhile(() => (
        store.getState().user.loggedIn
        && store.getState().lobby.exists === false
      ))
    )
    .mapTo(list());


export default combineEpics(
  wsTransmitEpic,
  updateTriggersEpic,
  listTriggersEpic,
  ...lobbyNotificationsEpics
);