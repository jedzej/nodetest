import { ofType, combineEpics } from 'redux-observable';
import { map, mapTo } from 'rxjs/operators';
import { webSocketWrite } from 'webSocketMiddleware'
import observerNotificationsEpics from './notifications';

import * as types from './types';
import { join } from './actions';
import { list, update } from '../lobby/actions';
import { OBSERVER_SESSION_INTENT, OBSERVER_JOIN_REJECTED, OBSERVER_JOIN_FULFILLED } from './types';
import Rx from 'rxjs/Rx';
import { first } from 'rxjs/operator/first';
import { takeUntil } from 'rxjs/operator/takeUntil';


const wsTransmitEpic = action$ => action$
  .ofType(types.OBSERVER_JOIN)
  .let(webSocketWrite);


const joinEpic = action$ =>
  Rx.Observable.zip(
    action$.ofType("WEBSOCKET_OPENED"),
    action$.ofType(OBSERVER_SESSION_INTENT),
    (openedAction, sessionIntentAction) => sessionIntentAction.payload.token
  ).map(token => join(token))


const listTriggerEpic = action$ =>
  Rx.Observable.concat(
    action$.ofType(OBSERVER_JOIN_REJECTED).first(),
    Rx.Observable.interval(3000)
  )
    .takeUntil(action$.ofType(OBSERVER_JOIN_FULFILLED))
    .mapTo(list())

const updateTriggerEpic = action$ => action$
  .ofType(OBSERVER_JOIN_FULFILLED).first()
  .mapTo(update())


export default combineEpics(
  wsTransmitEpic,
  joinEpic,
  listTriggerEpic,
  updateTriggerEpic,
  ...observerNotificationsEpics
);
