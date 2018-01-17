import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import * as types from './types'

const wsTransmitEpic = action$ => action$
  .ofType(types.RSP_START, types.RSP_MOVE)
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);