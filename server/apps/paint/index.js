const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const check = require('../../modules/check');
const appService = require('../../modules/app/service');
const MANIFEST = require('../../../src/apps/paint/manifest')
const rejectionAction = tools.rejectionAction

const assignColor = store => {
  const color = store.availableColors[Math.floor(store.availableColors.length * Math.random())];
  store.availableColors = store.availableColors.filter(c => c != color);
  return color;
}

const createUser = (appContext, user) => ({
  _id: user._id,
  name: user.name,
  style: assignColor(appContext.store),
  paths: []
})


const PAINT_APP_HANDLERS = {

  'APP_START_HOOK': (action, appContext) => {
    console.log('PAINT START', action)
    if (action.payload.name !== MANIFEST.NAME)
      return;
    const members = appContext.lobby.members;
    appContext.store.availableColors = MANIFEST.CONSTS.COLORS;

    appContext.store.users = members.map(m => createUser(appContext, m));
    return appContext.commit();
  },

  'APP_TERMINATE_HOOK': (action, appContext) => {
    console.log('PAINT TERMINATE', appContext.exists);
  },

  'LOBBY_JOIN_HOOK': (action, appContext) => {
    console.log('PAINT JOIN', appContext.exists);
  },

  'LOBBY_LEAVE_HOOK': (action, appContext) => {
    console.log('PAINT LEAVE', appContext.exists);
  },

  'LOBBY_KICK_HOOK': (action, appContext) => {
    console.log('PAINT KICK', appContext.exists);
  },

  [MANIFEST.CONSTS.ACTION.PAINT_SKETCH]: (action, appContext) => {
    const currentUser = appContext.currentUser;
    appContext.store.actions.push({
      author: currentUser,
      ...action
    });
    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },

  [MANIFEST.CONSTS.ACTION.PAINT_FILL]: (action, appContext) => {
    const currentUser = appContext.currentUser;
    const ownShape = appContext.store.actions.some(a => (
      a.payload.timestamp === action.payload.timestamp
      && a.author._id === currentUser._id
    ));

    if(ownShape) {
      appContext.store.actions.push({
        author: currentUser,
        ...action
      })
    }

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },

  [MANIFEST.CONSTS.ACTION.PAINT_UNDO]: (action, appContext) => {
    const currentUser = appContext.currentUser;
    var paths = appContext.store.paths.reverse();
    const index = paths.findIndex(p => p.author._id.equals(currentUser._id));
    if (index >= 0)
      paths = paths.filter((_, i) => i != index);
    paths.reverse();
    appContext.store.paths = paths;

    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },

  [MANIFEST.CONSTS.ACTION.PAINT_CLEAR]: (action, appContext) => {
    appContext.store.paths = [];
    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  }
}

module.exports = {
  handlers: PAINT_APP_HANDLERS,
  manifest: MANIFEST
}
