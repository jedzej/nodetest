import { ofType } from "redux-observable";
import { pairwise, filter, map, flatMap } from "rxjs/operators";
import Rx from 'rxjs/Rx';

import * as types from "./types";
import { simpleNotificationSuccess, simpleNotificationError, simpleNotificationInfoAction } from "../common/operators";
import { notification } from "../chat/actions";

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

      map(mPair => {
        const crossFind = (membersMore, membersFewer) =>
          membersMore.find(m1 => membersFewer.every(m2 => m1._id !== m2._id));
          console.log(mPair)
        if (mPair[1].length > mPair[0].length) {
          return crossFind(mPair[1], mPair[0]).name + " joined"
        } else {
          return crossFind(mPair[0], mPair[1]).name + " left"
        }
      }),
      flatMap(message => Rx.Observable.of(
        simpleNotificationInfoAction(message),
        notification(message)
      ))
    )
]

export default lobbyNotificationsEpics;