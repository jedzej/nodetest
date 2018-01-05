import { ofType, combineEpics } from 'redux-observable';
import { mapTo } from 'rxjs/operators';
import { webSocketWrite } from 'webSocketMiddleware'
import { LOBBY_CREATE, LOBBY_LIST, LOBBY_LEAVE, LOBBY_JOIN, LOBBY_UPDATE_REQUEST } from './types'
import { USER_UPDATE, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED } from '../user/types'
import { update } from './actions'

const lobbyEpic = action$ =>
  action$.pipe(
    ofType(LOBBY_CREATE,
      LOBBY_LIST,
      LOBBY_LEAVE,
      LOBBY_JOIN,
      LOBBY_UPDATE_REQUEST),
    webSocketWrite
  );


const userLoginLogoutEpic = action$ =>
  action$.pipe(
    ofType(USER_UPDATE),
    mapTo(update())
  );

export default combineEpics(lobbyEpic, userLoginLogoutEpic);