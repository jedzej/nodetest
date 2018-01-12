import { ofType, combineEpics } from 'redux-observable';
import { mapTo, filter } from 'rxjs/operators';
import { webSocketWrite } from '../../webSocketMiddleware'
import { CHAT_MESSAGE } from './types'
import { truncate } from './actions'
import { LOBBY_UPDATE, LOBBY_UPDATE_REJECTED } from '../lobby/types';

const chatEpic = action$ =>
  action$.pipe(
    ofType(CHAT_MESSAGE),
    webSocketWrite
  );

const chatTruncateEpic = (action$, store) =>
  action$.pipe(
    ofType(LOBBY_UPDATE, LOBBY_UPDATE_REJECTED),
    filter(() => store.getState().lobby.exists === false),
    mapTo(truncate())
  );

export default combineEpics(
  chatEpic,
  chatTruncateEpic
);