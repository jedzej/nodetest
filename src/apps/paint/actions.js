import MANIFEST from './manifest'
const {ACTION} = MANIFEST.CONSTS;

export const sketch = path => ({
  type: ACTION.PAINT_SKETCH,
  payload: {path}
});
