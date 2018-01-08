import { ofType, combineEpics } from 'redux-observable';
import { USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED, USER_UPDATE, USER_LOGOUT_REJECTED, USER_UPDATE_REQUEST, USER_UPDATE_REJECTED } from './types'
import { loginByToken, update } from './actions'
import { webSocketWrite } from 'webSocketMiddleware'
import { map, mapTo, forEach, filter, tap, ignoreElements } from 'rxjs/operators';


const wsTransmitEpic = action$ =>
  action$.pipe(
    ofType(USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_UPDATE_REQUEST),
    webSocketWrite
  );

const storeTokenEpic = action$ =>
  action$.pipe(
    ofType(USER_UPDATE),
    tap(action => sessionStorage.setItem("AUTH_TOKEN",action.payload.token)),
    ignoreElements()
  );

const removeTokenEpic = action$ =>
  action$.pipe(
    ofType(USER_UPDATE_REJECTED, USER_LOGIN_REJECTED),
    tap(action => sessionStorage.removeItem("AUTH_TOKEN")),
    ignoreElements()
  );

const updateTriggerEpic = action$ =>
  action$.pipe(
    ofType(USER_LOGOUT_REJECTED),
    mapTo(update())
  );


const loginWithTokenEpic = action$ =>
  action$.pipe(
    ofType("WEBSOCKET_OPENED"),
    mapTo(sessionStorage.getItem("AUTH_TOKEN")),
    filter(token => token != undefined),
    map(token => loginByToken(token))
  );

export default combineEpics(
  wsTransmitEpic,
  storeTokenEpic,
  loginWithTokenEpic,
  removeTokenEpic,
  updateTriggerEpic
);