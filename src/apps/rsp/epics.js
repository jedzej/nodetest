import { combineEpics } from 'redux-observable';
import { webSocketWrite } from 'webSocketMiddleware'

import * as types from './types'
import { APP_UPDATE } from '../../logic/app/types';
import { update } from './actions';


const wsTransmitEpic = action$ => action$
  .ofType(types.RSP_START, types.RSP_MOVE, types.RSP_UPDATE_REQUEST, types.RSP_TERMINATE)
  .let(webSocketWrite)

const rspUpdateTrigger = (action$, store) => action$
  .ofType(APP_UPDATE)
  .filter(action => action.payload.some(app => app.name === 'rsp'))
  .mapTo(update())


export default combineEpics(
  wsTransmitEpic,
  rspUpdateTrigger
);