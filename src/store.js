import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { createWebSocketMiddleWare } from './webSocketMiddleware';
import userEpics from './logic/user/epics';
import helloEpics from './logic/hello/epics';


import userReducer from './logic/user/reducers';
import helloReducer from './logic/hello/reducers';


const rootEpic = combineEpics(
  helloEpics,
  userEpics
);

export default createStore(
  combineReducers({
    'hello': helloReducer,
    'user': userReducer
  }),
  {},
  applyMiddleware(
    logger,
    thunk,
    promise(),
    createWebSocketMiddleWare('ws://localhost:3004'),
    createEpicMiddleware(rootEpic)
  )
);
