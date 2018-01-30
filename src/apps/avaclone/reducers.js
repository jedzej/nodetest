import MANIFEST from './manifest'
import { APP_UPDATE_REJECTED } from '../../logic/app/types';

const { ACTION } = MANIFEST.CONSTS;

const DEFAULT_STATE = {
  store: MANIFEST.DEFAULT_STORE,
};


const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION.APP_UPDATE_AVACLONE:
      let newState = {};
      newState.store = action.payload.store;
      state = newState;
      break;
    case APP_UPDATE_REJECTED:
      state = DEFAULT_STATE;
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
