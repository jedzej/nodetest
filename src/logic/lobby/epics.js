import { ofType } from 'redux-observable';
import { USER_REGISTER, USER_LOGIN, USER_LOGOUT } from './types'
import { webSocketWrite } from 'webSocketMiddleware'



const userEpic = action$ =>
  action$.pipe(
    ofType(USER_REGISTER, USER_LOGIN, USER_LOGOUT),
    webSocketWrite 
  );

export default userEpic;