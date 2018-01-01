import { map } from 'rxjs/operators';

var ws = undefined;

export const webSocketWrite = map(action => ({
  type: "WEBSOCKET_WRITE",
  payload: action
}));

export const createWebSocketMiddleWare = url => store => {

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

  return next => action => {
    switch (action.type) {
      case "WEBSOCKET_WRITE":
        ws.send(JSON.stringify(action.payload));
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
