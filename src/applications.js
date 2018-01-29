import rspConfig from './apps/rsp/config';
import paintConfig from './apps/paint/config';
import avacloneConfig from './apps/avaclone/config';

const applications = {
  [rspConfig.MANIFEST.NAME]: rspConfig,
  [paintConfig.MANIFEST.NAME]: paintConfig,
  [avacloneConfig.MANIFEST.NAME]: avacloneConfig
};

export default applications;
