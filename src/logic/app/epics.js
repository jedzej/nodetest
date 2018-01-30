import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'

import * as types from './types'
import { update } from './actions';
import { LOBBY_UPDATE } from '../lobby/types';
import appNotificationsEpics from './notifications'
import { APP_UPDATE } from './types';
import Rx from 'rxjs'

const wsTransmitEpic = action$ => action$
  .ofType(types.APP_UPDATE_REQUEST, types.APP_TERMINATE, types.APP_START)
  .let(webSocketWrite)

const updateTriggerEpic = action$ => action$
  .ofType(LOBBY_UPDATE)
  .mapTo(update());

const splitAppUpdatesEpic = action$ => action$
  .ofType(
  APP_UPDATE
  )
  .flatMap(action => Rx.Observable.from(Object.keys(action.payload).map(
    appName => ({
      type: APP_UPDATE + '_' + appName.toUpperCase(),
      payload: action.payload[appName]
    })
  )))


export default combineEpics(
  wsTransmitEpic,
  updateTriggerEpic,
  splitAppUpdatesEpic,
  ...appNotificationsEpics
);