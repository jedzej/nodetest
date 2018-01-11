import * as types from './types'

const DEFAULT_STATE = [];


const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case types.APP_UPDATE:
      state = [...action.payload];
      break;
    case types.APP_UPDATE_REJECTED:
      state = DEFAULT_STATE;
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
