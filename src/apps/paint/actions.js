import MANIFEST from './manifest'
const { ACTION } = MANIFEST.CONSTS;

export const sketch = (path, color) => ({
  type: ACTION.PAINT_SKETCH,
  payload: { path, color }
});

export const undo = path => ({
  type: ACTION.PAINT_UNDO
});

export const clear = () => ({
  type: ACTION.PAINT_CLEAR
});
