import { combineEpics } from 'redux-observable';
import Rx from 'rxjs/Rx';
import { webSocketOpen } from '../../webSocketMiddleware';


const wsReconnectEpic = action$ =>
  Rx.Observable.concat(
    action$.ofType("WEBSOCKET_CLOSED"),
    Rx.Observable.interval(3000)
  )
    .do(a => console.log('ws closed', a))
    .takeUntil(action$.ofType("WEBSOCKET_OPENED"))
    .mapTo(webSocketOpen());



export default combineEpics(
  wsReconnectEpic
);
