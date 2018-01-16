import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import * as types from './types'

const wsTransmitEpic = action$ => action$
  .ofType(types.RSP_START, types.RSP_MOVE, types.RSP_UPDATE_REQUEST, types.RSP_TERMINATE)
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);