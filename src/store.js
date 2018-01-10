import { createStore, combineReducers, applyMiddleware } from "redux";
//import logger from "redux-logger";
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { reducer as notificationsReducer } from 'react-notification-system-redux';
import { createWebSocketMiddleWare, webSocketReducer } from './webSocketMiddleware';

import helloEpics from './logic/hello/epics';
import userEpics from './logic/user/epics';
import lobbyEpics from './logic/lobby/epics';
import chatEpics from './logic/chat/epics';
import observerEpics from './logic/observer/epics';

import helloReducer from './logic/hello/reducers';
import userReducer from './logic/user/reducers';
import lobbyReducer from './logic/lobby/reducers';
import chatReducer from './logic/chat/reducers';
import ovserverReducer from './logic/observer/reducers';
import { routerReducer, routerMiddleware } from "react-router-redux";


const rootEpic = combineEpics(
  helloEpics,
  userEpics,
  lobbyEpics,
  chatEpics,
  observerEpics
);

const rootReducer = combineReducers({
  'websocket': webSocketReducer,
  'notifications': notificationsReducer,
  'router': routerReducer,
  'hello': helloReducer,
  'user': userReducer,
  'lobby': lobbyReducer,
  'chat': chatReducer,
  'observer': ovserverReducer
});


export default history => createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(
    //logger,
    createWebSocketMiddleWare('ws://localhost:3004'),
    createEpicMiddleware(rootEpic),
    routerMiddleware(history)
  )
);
