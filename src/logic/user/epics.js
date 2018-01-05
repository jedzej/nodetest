import { ofType, combineEpics } from 'redux-observable';
import { USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_LOGIN_FULFILLED, USER_LOGIN_REJECTED } from './types'
import { webSocketWrite } from 'webSocketMiddleware'
import { mapTo } from 'rxjs/operators';


const wsTransmitEpic = action$ =>
  action$.pipe(
    ofType(USER_REGISTER, USER_LOGIN, USER_LOGOUT),
    webSocketWrite
  );


export default wsTransmitEpic