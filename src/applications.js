import rspConfig from './apps/rsp/config';
import paintConfig from './apps/paint/config';

const applications = {
  [rspConfig.MANIFEST.NAME]: rspConfig,
  [paintConfig.MANIFEST.NAME]: paintConfig
};

export default applications;
