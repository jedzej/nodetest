import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import MANIFEST from './manifest'

const ACTION = MANIFEST.CONSTS.ACTION;

const wsTransmitEpic = action$ => action$
  .ofType(ACTION.RSP_MOVE)
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);
