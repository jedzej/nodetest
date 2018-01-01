import { ofType } from 'redux-observable';
import { USER_REGISTER, USER_LOGIN } from './types'
import { webSocketWrite } from 'webSocketMiddleware'



const userEpic = action$ =>
  action$.pipe(
    ofType(USER_REGISTER, USER_LOGIN),
    webSocketWrite
  );

export default userEpic;