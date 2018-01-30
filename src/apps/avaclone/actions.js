import MANIFEST from './manifest'
const { ACTION } = MANIFEST.CONSTS;

export const configure = configuration => ({
  type: ACTION.AVACLONE_CONFIGURE,
  payload: { configuration }
});
