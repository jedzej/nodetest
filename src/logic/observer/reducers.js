import * as types from './types'

const DEFAULT_STATE = {
  joinPending: false,
  joined: false
};


const reducer = (state = DEFAULT_STATE, action) => {
  // register
  switch (action.type) {
    case types.OBSERVER_JOIN:
      state = {
        ...state,
        joinPending: true
      };
      break;
    case types.OBSERVER_JOIN_FULFILLED:
    state = {
      joined: true,
      joinPending: false
    };
    break;
    case types.OBSERVER_JOIN_REJECTED:
      state = {
        joined: false,
        joinPending: false
      };
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
