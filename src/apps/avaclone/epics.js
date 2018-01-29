import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'
import Rx from 'rxjs';
import MANIFEST from './manifest'
import { APP_UPDATE } from '../../logic/app/types';

const ACTION = MANIFEST.CONSTS.ACTION;

const wsTransmitEpic = action$ => action$
  .ofType(
  ACTION.PAINT_SKETCH,
  ACTION.PAINT_UNDO,
  ACTION.PAINT_CLEAR,
  ACTION.PAINT_FILL
  )
  .let(webSocketWrite)

const splitAppUpdatesEpic = action$ => action$
  .ofType(
  APP_UPDATE
  )
  .do(action=>console.log(Object.keys(action.payload).map(
    appName => ({
      type: APP_UPDATE + '_' + appName.toUpperCase(),
      payload: action.payload[appName]
    })
  )))
  .flatMap(action => Rx.Observable.from(Object.keys(action.payload).map(
    appName => ({
      type: APP_UPDATE + '_' + appName.toUpperCase(),
      payload: action.payload[appName]
    })
  )))


export default combineEpics(
  wsTransmitEpic,
  splitAppUpdatesEpic
);
