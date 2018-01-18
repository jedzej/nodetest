import { ofType } from "redux-observable";
import { pairwise, filter, map } from "rxjs/operators";

import * as types from "./types";
import { simpleNotificationSuccess, simpleNotificationError, simpleNotificationInfoAction } from "../common/operators";


const appNotificationsEpics = [
  action$ => action$.ofType(
    types.APP_START_REJECTED,
    types.APP_TERMINATE_REJECTED)
    .let(simpleNotificationError('Operation rejected!'))
]

export default appNotificationsEpics;