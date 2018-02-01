import * as types from "./types";
import { simpleNotificationError } from "../common/operators";


const appNotificationsEpics = [
  action$ => action$.ofType(
    types.APP_START_REJECTED,
    types.APP_TERMINATE_REJECTED)
    .let(simpleNotificationError('Operation rejected!')),

  action$ => action$.ofType(
    types.APP_ERROR,
    types.APP_TERMINATE_REJECTED)
    .do(action => console.error(action.payload.stack))
    .let(simpleNotificationError('Error'))
]

export default appNotificationsEpics;