import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import MANIFEST from './manifest'

const ACTION = MANIFEST.CONSTS.ACTION;

const wsTransmitEpic = action$ => action$
  .ofType(
  ACTION.PAINT_SKETCH,
  ACTION.PAINT_UNDO,
  ACTION.PAINT_CLEAR,
  ACTION.PAINT_FILL
  )
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);
