import { combineEpics, ofType } from 'redux-observable';
import Rx from 'rxjs/Rx';
import { webSocketOpen } from '../../webSocketMiddleware';


const wsReconnectEpic = action$ =>
  Rx.Observable.combineLatest(
    action$.ofType("WEBSOCKET_CLOSED", "WEBSOCKET_OPENED"),
    Rx.Observable.interval(3000)
  )
    .map(([action,_]) => action)
    .let(ofType("WEBSOCKET_CLOSED"))
    .mapTo(webSocketOpen());


export default combineEpics(
  wsReconnectEpic
);
