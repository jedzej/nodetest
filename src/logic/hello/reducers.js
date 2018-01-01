import * as types from './types'

const DEFAULT_STATE = {
  isPending: false,
  isFulfilled: false,
  isRejected: false
};


const reducer = (state = DEFAULT_STATE, action) => {
  // register
  switch (action.type) {
    case types.HELLO:
      state = {
        isPending: true,
        isFulfilled: false,
        isRejected: false
      };
      break;
    case types.HELLO_FULFILLED:
      state = {
        isPending: false,
        isFulfilled: true,
        isRejected: false
      };
      break;
    case types.HELLO_REJECTED:
      state = {
        isPending: false,
        isFulfilled: false,
        isRejected: true
      };
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
