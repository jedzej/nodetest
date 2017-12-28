import SapiModule from './SapiModule'
import authSapi from './auth'

class LobbySapiModule extends SapiModule {
  constructor() {
    super();
    var _this = this;

    this.on('attach', function () {
      this.sClient.on('lobby/update', function (message) {
        var currentLobby = { ...message };
        delete currentLobby.event;
        _this.sClient.addTag('currentLobby', currentLobby);
        _this.emit('update', currentLobby);
      });
      authSapi.on('update', function () {
        _this.requestUpdate();
      });
    });
  }

  requestUpdate() {
    if (this.isAttached())
      return this.sClient.send('lobby/update/request');
  }

  create() {
    if (this.isAttached())
      return this.sClient.request('lobby/create');
  }

  getCurrentLobby() {
    if (this.isAttached())
      return this.sClient.getTag('currentLobby');
  }
}

export default new LobbySapiModule();