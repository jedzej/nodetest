import { ofType, combineEpics } from 'redux-observable';
import { webSocketWrite } from 'webSocketMiddleware'
import { CHAT_MESSAGE } from './types'

const chatEpic = action$ =>
  action$.pipe(
    ofType(CHAT_MESSAGE),
    webSocketWrite
  );

export default chatEpic;