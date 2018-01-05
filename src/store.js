import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { createWebSocketMiddleWare } from './webSocketMiddleware';

import helloEpics from './logic/hello/epics';
import userEpics from './logic/user/epics';
import lobbyEpics from './logic/lobby/epics';

import helloReducer from './logic/hello/reducers';
import userReducer from './logic/user/reducers';
import lobbyReducer from './logic/lobby/reducers';


const rootEpic = combineEpics(
  helloEpics,
  userEpics,
  lobbyEpics
);

export default createStore(
  combineReducers({
    'hello': helloReducer,
    'user': userReducer,
    'lobby': lobbyReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    logger,
    thunk,
    promise(),
    createWebSocketMiddleWare('ws://localhost:3004'),
    createEpicMiddleware(rootEpic)
  )
);
