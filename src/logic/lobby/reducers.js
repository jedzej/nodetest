import * as types from './types'

const DEFAULT_STATE = {
  lobbiesList: [],
  leaderId: undefined,
  members: [],
  createPending: false,
  joinPending: false,
  leavePending: false,
  exists : false
};


const reducer = (state = DEFAULT_STATE, action) => {
  // CREATE
  switch (action.type) {
    case types.LOBBY_CREATE:
      state = {
        ...state,
        createPending: true
      };
      break;
    case types.LOBBY_CREATE_FULFILLED:
    case types.LOBBY_CREATE_REJECTED:
      state = {
        ...state,
        createPending: false
      };
      break;
    // JOIN
    case types.LOBBY_JOIN:
      state = {
        ...state,
        joinPending: true
      };
      break;
    case types.LOBBY_JOIN_FULFILLED:
    case types.LOBBY_JOIN_REJECTED:
      state = {
        ...state,
        joinPending: false
      };
      break;
    // UPDATE
    case types.LOBBY_UPDATE_REJECTED:
      state = {
        ...DEFAULT_STATE
      }
      break;
    case types.LOBBY_UPDATE:
      state = {
        ...state,
        ...action.payload,
        exists : action.payload.token !== null
      };
      break;
    // LOBBY LIST
    case types.LOBBY_LIST_FULFILLED:
      state = {
        ...state,
        lobbiesList : action.payload
      }
      break;
    default:
      break;
  }
  return state;
};

export default reducer;
