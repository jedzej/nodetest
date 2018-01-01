import { ofType } from 'redux-observable';
import { HELLO } from './types'
import { webSocketWrite } from 'webSocketMiddleware'

const helloEpic = action$ =>
  action$.pipe(
    ofType(HELLO),
    webSocketWrite
  );

export default helloEpic;
