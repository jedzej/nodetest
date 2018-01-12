import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import * as types from './types'
import { update } from './actions';
import { LOBBY_UPDATE } from '../lobby/types';


const wsTransmitEpic = action$ => action$
  .ofType(types.APP_UPDATE_REQUEST)
  .let(webSocketWrite)

const updateTriggerEpic = action$ => action$
  .ofType(LOBBY_UPDATE)
  .mapTo(update());

export default combineEpics(
  wsTransmitEpic,
  updateTriggerEpic
);