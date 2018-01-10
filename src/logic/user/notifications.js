import { ofType } from "redux-observable";
import { simpleNotificationSuccess, simpleNotificationError } from "../common/operators";
import * as types from "./types";

const userNotificationsEpics = [
  action$ => action$.pipe(
    ofType(types.USER_LOGIN_FULFILLED),
    simpleNotificationSuccess('Logged in!')
  ),
  action$ => action$.pipe(
    ofType(types.USER_LOGIN_REJECTED),
    simpleNotificationError('Login rejected!')
  ),
  action$ => action$.pipe(
    ofType(types.USER_REGISTER_FULFILLED),
    simpleNotificationSuccess('User registered!')
  ),
  action$ => action$.pipe(
    ofType(types.USER_REGISTER_REJECTED),
    simpleNotificationError('Registration rejected!')
  ),
  action$ => action$.pipe(
    ofType(types.USER_LOGOUT_FULFILLED),
    simpleNotificationSuccess('Logged out!')
  ),
  action$ => action$.pipe(
    ofType(types.USER_LOGOUT_REJECTED),
    simpleNotificationError('Logout rejected!')
  ),
  action$ => action$.pipe(
    ofType(types.USER_KICKED_OUT),
    simpleNotificationError('User kicked out!')
  )
]

export default userNotificationsEpics;