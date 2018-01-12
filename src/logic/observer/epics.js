import { combineEpics, ofType } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'
import observerNotificationsEpics from './notifications';
import * as types from './types';
import { join } from './actions';
import { list, update } from '../lobby/actions';
import Rx from 'rxjs/Rx';


const wsTransmitEpic = action$ => action$
  .ofType(types.OBSERVER_JOIN)
  .let(webSocketWrite);

const joinEpic = action$ =>
  Rx.Observable.combineLatest(
    action$.ofType("WEBSOCKET_OPENED"),
    action$.ofType(types.OBSERVER_SESSION_INTENT),
    (openedAction, sessionIntentAction) => sessionIntentAction.payload.token
  ).map(token => join(token))

const listTriggerEpic = action$ =>
  Rx.Observable.combineLatest(
    action$.ofType(types.OBSERVER_JOIN_REJECTED, types.OBSERVER_JOIN_FULFILLED),
    Rx.Observable.interval(3000)
  )
    .map(([action, _]) => action)
    .let(ofType(types.OBSERVER_JOIN_REJECTED))
    .mapTo(list())

const updateTriggerEpic = action$ => action$
  .ofType(types.OBSERVER_JOIN_FULFILLED).first()
  .mapTo(update())


export default combineEpics(
  wsTransmitEpic,
  joinEpic,
  listTriggerEpic,
  updateTriggerEpic,
  ...observerNotificationsEpics
);
