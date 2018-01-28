import MANIFEST from './manifest'
const { ACTION } = MANIFEST.CONSTS;

export const sketch = (path, style, timestamp) => ({
  type: ACTION.PAINT_SKETCH,
  payload: { path, style, timestamp }
});

export const fill = (timestamp, style) => ({
  type: ACTION.PAINT_FILL,
  payload: { style, timestamp }
})

export const undo = path => ({
  type: ACTION.PAINT_UNDO
});

export const clear = () => ({
  type: ACTION.PAINT_CLEAR
});
