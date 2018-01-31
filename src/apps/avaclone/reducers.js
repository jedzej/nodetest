import MANIFEST from './manifest';
import { APP_UPDATE_REJECTED } from '../../logic/app/types';
import _ from 'lodash';

const { ACTION } = MANIFEST.CONSTS;

const DEFAULT_STATE = {
  store: MANIFEST.DEFAULT_STORE,
  configurationPending: false,
  localConfiguration: _.cloneDeep(MANIFEST.DEFAULT_STORE.configuration)
};


const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION.AVACLONE_CONFIGURE_FULFILLED:
      state = {
        ...state,
        configurationPending: false,
        localConfiguration: _.cloneDeep(state.store.configuration)
      };
      break;
    case ACTION.AVACLONE_CONFIGURE_REJECTED:
      state = {
        ...state,
        configurationPending: false,
      };
      break;
    case ACTION.AVACLONE_CONFIGURE:
      state = {
        ...state,
        configurationPending: true,
      };
      break;
    case ACTION.APP_UPDATE_AVACLONE:
      state = {
        ...state,
        store: action.payload.store,
        localConfiguration: state.configurationPending ?
          action.payload.configuration : state.localConfiguration
      };
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
