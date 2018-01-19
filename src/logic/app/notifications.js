import * as types from "./types";
import { simpleNotificationError } from "../common/operators";


const appNotificationsEpics = [
  action$ => action$.ofType(
    types.APP_START_REJECTED,
    types.APP_TERMINATE_REJECTED)
    .let(simpleNotificationError('Operation rejected!'))
]

export default appNotificationsEpics;