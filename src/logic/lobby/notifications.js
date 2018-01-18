import { ofType } from "redux-observable";
import { pairwise, filter, map } from "rxjs/operators";

import * as types from "./types";
import { simpleNotificationSuccess, simpleNotificationError, simpleNotificationInfoAction } from "../common/operators";

const lobbyNotificationsEpics = [
  action$ =>
    action$.pipe(
      ofType(types.LOBBY_CREATE_FULFILLED),
      simpleNotificationSuccess("Lobby created!")
    ),
  action$ =>
    action$.pipe(
      ofType(types.LOBBY_CREATE_REJECTED),
      simpleNotificationError('Lobby create rejected!')
    ),
  action$ => action$.ofType(types.LOBBY_JOIN_FULFILLED)
    .let(simpleNotificationSuccess("Lobby joined!")),

  action$ => action$.ofType(types.LOBBY_JOIN_REJECTED)
    .let(simpleNotificationError('Lobby join rejected!')),

  action$ => action$.ofType(types.LOBBY_LEAVE_FULFILLED)
    .let(simpleNotificationSuccess('Lobby left!')),

  action$ => action$.ofType(types.LOBBY_KICKED)
    .let(simpleNotificationError('Kicked from lobby!')),

  action$ =>
    action$.pipe(
      ofType(types.LOBBY_LEAVE_REJECTED),
      simpleNotificationError('Lobby leave rejected!')
    ),

  action$ =>
    action$.pipe(
      ofType(types.LOBBY_KICK_REJECTED),
      simpleNotificationError('Lobby kick rejected!')
    ),

  action$ =>
    action$.pipe(
      ofType(types.LOBBY_UPDATE),
      map(action => action.payload.members || []),
      pairwise(),
      filter(mPair =>
        mPair[0].length > 0 &&
        mPair[1].length > 0 &&
        mPair[0].length !== mPair[1].length),
      map(mPair => mPair[1].length > mPair[0].length ? "Someone joined!" : "Someone left!"),
      map(message => simpleNotificationInfoAction(message))
    )
]

export default lobbyNotificationsEpics;