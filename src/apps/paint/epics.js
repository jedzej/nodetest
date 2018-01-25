import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import MANIFEST from './manifest'

const ACTION = MANIFEST.CONSTS.ACTION;

const wsTransmitEpic = action$ => action$
  .do(a => console.log(a))
  .ofType(ACTION.PAINT_SKETCH)
  .do(a => console.log("PASSED",a))
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);
