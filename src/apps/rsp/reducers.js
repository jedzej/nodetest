import * as types from './types'
import DEFAULT_STATE from './default.json'

const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case types.RSP_UPDATE:
      state = {...action.payload};
      break;
    case types.RSP_START_REJECTED:
      state = {...DEFAULT_STATE};
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
