import { ofType, combineEpics } from 'redux-observable';
import { map, mapTo, filter, tap, ignoreElements } from 'rxjs/operators';
import { webSocketWrite } from '../../webSocketMiddleware'
import userNotificationsEpics from './notifications';

import * as types from './types'
import { loginByToken, update } from './actions'
import { USER_SESSION_INTENT } from './types';
import Rx from 'rxjs/Rx';

const wsTransmitEpic = action$ =>
  action$.pipe(
    ofType(
      types.USER_REGISTER,
      types.USER_LOGIN,
      types.USER_LOGOUT,
      types.USER_UPDATE_REQUEST),
    webSocketWrite
  );

const storeTokenEpic = action$ =>
  action$.pipe(
    ofType(types.USER_UPDATE),
    tap(action => sessionStorage.setItem("AUTH_TOKEN", action.payload.token)),
    ignoreElements()
  );

const removeTokenEpic = action$ =>
  action$.pipe(
    ofType(types.USER_UPDATE_REJECTED, types.USER_LOGIN_REJECTED, types.USER_KICKED_OUT),
    tap(action => sessionStorage.removeItem("AUTH_TOKEN")),
    ignoreElements()
  );

const updateTriggerEpic = action$ =>
  action$.pipe(
    ofType(types.USER_LOGOUT_REJECTED),
    mapTo(update())
  );

const loginWithTokenEpic = action$ =>
  Rx.Observable.combineLatest(
    action$.ofType("WEBSOCKET_OPENED"),
    action$.ofType(USER_SESSION_INTENT),
    () => sessionStorage.getItem("AUTH_TOKEN")
  ).pipe(
    filter(token => token),
    map(token => loginByToken(token))
    )



export default combineEpics(
  wsTransmitEpic,
  storeTokenEpic,
  loginWithTokenEpic,
  removeTokenEpic,
  updateTriggerEpic,
  ...userNotificationsEpics
);
