import { ofType } from "redux-observable";
import { simpleNotificationSuccess, simpleNotificationError } from "../common/operators";
import * as types from "./types";

const userNotificationsEpics = [
  action$ => action$.pipe(
    ofType(types.OBSERVER_JOIN_FULFILLED),
    simpleNotificationSuccess('Observer joined!')
  ),
  action$ => action$.pipe(
    ofType(types.OBSERVER_JOIN_REJECTED),
    simpleNotificationError('Access rejected!')
  ),
  action$ => action$.pipe(
    ofType(types.OBSERVER_KICKED_OUT),
    simpleNotificationSuccess('Observer kicked out!')
  ),
]

export default userNotificationsEpics;