import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import MANIFEST from './manifest'

const type = MANIFEST.consts.action.type;

const wsTransmitEpic = action$ => action$
  .ofType(type.RSP_MOVE)
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);
