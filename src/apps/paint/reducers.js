import MANIFEST from './manifest'
import { APP_UPDATE_REJECTED } from '../../logic/app/types';

const { ACTION } = MANIFEST.CONSTS;

const DEFAULT_STATE = {
  store: MANIFEST.DEFAULT_STORE,
  shapes: [],
};


const reducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTION.APP_UPDATE_PAINT:
      state.store = action.payload.store;
      state.shapes = [];
      // go through actions history
      state.store.actions.forEach(a => {
        if (a.type === ACTION.PAINT_SKETCH) {
          // sketch
          state.shapes.push(a.payload);
        } else if (a.type === ACTION.PAINT_FILL) {
          // shape filling
          const shape = state.shapes.find(
            shape => shape.timestamp === a.payload.timestamp
          );
          if(shape){
            shape.isFilled = true;
            shape.style = a.payload.style;
          }
        }
      });
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
