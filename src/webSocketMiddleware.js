import { map } from 'rxjs/operators';
export const WEBSOCKET_NOT_INITIALIZED = "WEBSOCKET_NOT_INITIALIZED";
export const WEBSOCKET_OPENED = "WEBSOCKET_OPENED";
export const WEBSOCKET_CLOSED = "WEBSOCKET_CLOSED";
export const WEBSOCKET_ERROR = "WEBSOCKET_ERROR";

const DEFAULT_STATE = WEBSOCKET_NOT_INITIALIZED;

export const webSocketWrite = map(action => ({
  type: "WEBSOCKET_WRITE",
  payload: action
}));

export const webSocketOpen = () => ({
  type: "WEBSOCKET_OPEN"
});

export const webSocketReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case "WEBSOCKET_OPEN":
      state = WEBSOCKET_OPENED;
      break;
    case "WEBSOCKET_ERROR":
      state = WEBSOCKET_ERROR;
      break;
    default:
      break;
  }
  return state;
};

export const createWebSocketMiddleWare = url => store => {

  var ws = null;

  return next => action => {
    switch (action.type) {
      case "WEBSOCKET_OPEN":
        if (ws === null) {

          ws = new WebSocket(url);

          ws.onmessage = (event) => {
            store.dispatch({
              type: "WEBSOCKET_RECEIVED",
              payload: JSON.parse(event.data)
            });
          }

          ws.onerror = (event) => {
            store.dispatch({
              type: "WEBSOCKET_ERROR"
            });
          };

          ws.onclose = (event) => {
            store.dispatch({
              type: "WEBSOCKET_CLOSED",
              payload: event
            });
          };

          ws.onopen = (event) => {
            store.dispatch({
              type: "WEBSOCKET_OPENED",
              payload: event
            });
          };
        }
        break;
      case "WEBSOCKET_WRITE":
        if (ws !== null) {
          ws.send(JSON.stringify(action.payload));
        } else {
          store.dispatch({
            type: "WEBSOCKET_ERROR",
            payload: "ENOTOPENED"
          })
        }
        break;
      case "WEBSOCKET_RECEIVED":
        store.dispatch({
          type: action.payload.type,
          payload: action.payload.payload
        })
        break;
      default:
        break;
    }
    next(action);
  }
}
