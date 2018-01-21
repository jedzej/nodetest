import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'
import userNotificationsEpics from './notifications';

import * as types from './types'
import { loginByToken, update } from './actions'
import { USER_SESSION_INTENT } from './types';
import Rx from 'rxjs/Rx';


const wsTransmitEpic = action$ => action$
  .ofType(
  types.USER_REGISTER,
  types.USER_LOGIN,
  types.USER_LOGOUT,
  types.USER_UPDATE_REQUEST)
  .let(webSocketWrite);


const storeTokenEpic = action$ => action$
  .ofType(types.USER_UPDATE)
  .do(action => sessionStorage.setItem("AUTH_TOKEN", action.payload.token))
  .ignoreElements();


const removeTokenEpic = action$ => action$
  .ofType(
  types.USER_UPDATE_REJECTED,
  types.USER_LOGIN_REJECTED,
  types.USER_KICKED_OUT,
  types.USER_LOGOUT_FULFILLED)
  .do(action => sessionStorage.removeItem("AUTH_TOKEN"))
  .ignoreElements();


const updateTriggerEpic = action$ =>
  action$.ofType(
    types.USER_LOGOUT_REJECTED)
    .mapTo(update());

    
const loginWithTokenEpic = action$ =>
  Rx.Observable.combineLatest(
    action$.ofType("WEBSOCKET_OPENED"),
    action$.ofType(USER_SESSION_INTENT),
    () => sessionStorage.getItem("AUTH_TOKEN")
  )
    .filter(token => token)
    .map(token => loginByToken(token))


export default combineEpics(
  wsTransmitEpic,
  storeTokenEpic,
  loginWithTokenEpic,
  removeTokenEpic,
  updateTriggerEpic,
  ...userNotificationsEpics
);
