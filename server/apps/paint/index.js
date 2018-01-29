const sapi = require('../../sapi');
const tools = require('../../modules/tools');
const check = require('../../modules/check');
const appService = require('../../modules/app/service');
const MANIFEST = require('../../../src/apps/paint/manifest')
const rejectionAction = tools.rejectionAction


const createUser = (appContext, user) => ({
  _id: user._id,
  name: user.name,
  undoCount: 0
})



const PAINT_APP_HANDLERS = {


  'APP_START_HOOK': (action, appContext) => {
    if (action.payload.name !== MANIFEST.NAME)
      return;
    const members = appContext.lobby.members;

    appContext.store.users = members.reduce((map, member) => {
      map[member._id] = createUser(appContext, member);
      return map;
    }, {});
    return appContext.commit();
  },


  'APP_TERMINATE_HOOK': (action, appContext) => {
    console.log('PAINT TERMINATE', appContext.exists);
  },


  'LOBBY_JOIN_HOOK': (action, appContext) => {
    console.log('PAINT JOIN', appContext.exists);
    const { store, currentUser } = appContext;
    if (store.users[currentUser._id] === undefined) {
      store.users[currentUser._id] = createUser(appContext, currentUser);
      appContext.commit()
        .then(() => appContext.doAppUpdate());
    }
  },


  'LOBBY_LEAVE_HOOK': (action, appContext) => {
    console.log('PAINT LEAVE', appContext.exists);
  },


  'LOBBY_KICK_HOOK': (action, appContext) => {
    console.log('PAINT KICK', appContext.exists);
  },


  [MANIFEST.CONSTS.ACTION.PAINT_SKETCH]: (action, appContext) => {
    const store = appContext.store;
    const currentUser = appContext.currentUser;

    store.actions.push({
      type: action.type,
      payload: {
        ...action.payload,
        author: currentUser
      }
    });
    store.users[currentUser._id].undoCount++;
    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  },


  [MANIFEST.CONSTS.ACTION.PAINT_FILL]: (action, appContext) => {
    const currentUser = appContext.currentUser;
    const store = appContext.store;
    const ownShape = appContext.store.actions.some(a => (
      a.payload.timestamp === action.payload.timestamp
      && a.payload.author._id.equals(currentUser._id)
    ));
    if (ownShape) {
      store.actions.push({
        type: action.type,
        payload: {
          ...action.payload,
          author: currentUser
        }
      })
      store.users[currentUser._id].undoCount++;
      return appContext.commit()
        .then(() => appContext.doAppUpdate());
    }
  },


  [MANIFEST.CONSTS.ACTION.PAINT_UNDO]: (action, appContext) => {

    const currentUser = appContext.currentUser;
    const store = appContext.store;

    if (store.users[currentUser._id].undoCount > 0) {
      let actions = store.actions.reverse();
      const index = actions.findIndex(
        p => p.payload.author._id.equals(currentUser._id));

      if (index >= 0)
        actions = actions.filter((_, i) => i != index);
      actions.reverse();
      appContext.store.actions = actions;
      store.users[currentUser._id].undoCount--;

      return appContext.commit()
        .then(() => appContext.doAppUpdate());
    }
  },

  [MANIFEST.CONSTS.ACTION.PAINT_CLEAR]: (action, appContext) => {
    appContext.store.actions = [];
    Object.values(appContext.store.users).forEach(appUser => {
      appUser.undoCount = 0;
    });
    return appContext.commit()
      .then(() => appContext.doAppUpdate());
  }
}

module.exports = {
  handlers: PAINT_APP_HANDLERS,
  manifest: MANIFEST
}
