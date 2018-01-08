import { ofType, combineEpics } from 'redux-observable';
import { USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED, USER_UPDATE, USER_LOGOUT_REJECTED, USER_UPDATE_REQUEST, USER_UPDATE_REJECTED, USER_REGISTER_FULFILLED, USER_REGISTER_REJECTED, USER_LOGOUT_FULFILLED, USER_KICKED_OUT } from './types'
import { loginByToken, update } from './actions'
import { webSocketWrite } from 'webSocketMiddleware'
import { map, mapTo, filter, tap, ignoreElements } from 'rxjs/operators';
import { simpleNotificationSuccess, simpleNotificationError } from '../common/operators'


const wsTransmitEpic = action$ =>
  action$.pipe(
    ofType(USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_UPDATE_REQUEST),
    webSocketWrite
  );

const storeTokenEpic = action$ =>
  action$.pipe(
    ofType(USER_UPDATE),
    tap(action => sessionStorage.setItem("AUTH_TOKEN", action.payload.token)),
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
    filter(token => token),
    map(token => loginByToken(token))
  );

const userNotificationsEpics = [
  action$ => action$.pipe(
    ofType(USER_LOGIN_FULFILLED),
    simpleNotificationSuccess('Logged in!')
  ),
  action$ => action$.pipe(
    ofType(USER_LOGIN_REJECTED),
    simpleNotificationError('Login rejected!')
  ),
  action$ => action$.pipe(
    ofType(USER_REGISTER_FULFILLED),
    simpleNotificationSuccess('User registered!')
  ),
  action$ => action$.pipe(
    ofType(USER_REGISTER_REJECTED),
    simpleNotificationError('Registration rejected!')
  ),
  action$ => action$.pipe(
    ofType(USER_LOGOUT_FULFILLED),
    simpleNotificationSuccess('Logged out!')
  ),
  action$ => action$.pipe(
    ofType(USER_LOGOUT_REJECTED),
    simpleNotificationError('Logout rejected!')
  ),
  action$ => action$.pipe(
    ofType(USER_KICKED_OUT),
    simpleNotificationError('User kicked out!')
  )
]


export default combineEpics(
  wsTransmitEpic,
  storeTokenEpic,
  loginWithTokenEpic,
  removeTokenEpic,
  updateTriggerEpic,
  ...userNotificationsEpics
);