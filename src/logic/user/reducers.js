import * as types from './types'

const DEFAULT_STATE = {
  name: undefined,
  token: undefined,
  registrationPending: false,
  loginPending: false,
  loggedIn : false
};


const reducer = (state = DEFAULT_STATE, action) => {
  // register
  switch (action.type) {
    case types.USER_REGISTER:
      state = {
        ...state,
        registrationPending: true
      };
      break;
    case types.USER_REGISTER_FULFILLED:
    case types.USER_REGISTER_REJECTED:
      state = {
        ...state,
        registrationPending: false
      };
      break;
    // login
    case types.USER_LOGIN:
      state = {
        ...state,
        loginPending: true
      };
      break;
    case types.USER_LOGIN_FULFILLED:
    case types.USER_LOGIN_REJECTED:
      state = {
        ...state,
        loginPending: false
      };
      break;
    // update
    case types.USER_UPDATE:
      state = {
        ...state,
        ...action.payload
      };
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
