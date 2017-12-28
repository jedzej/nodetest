import SapiModule from './SapiModule'

class AuthSapiModule extends SapiModule {
  constructor() {
    super();
    var _this = this;

    this.on('attach', function () {
      this.sClient.on('auth/update', function (message) {
        var currentUser = { ...message };
        delete currentUser.event;
        _this.sClient.addTag('currentUser', currentUser);
        _this.emit('update', currentUser);
      });
    });
  }

  register(name, password) {
    return this.sClient.request('auth/register', {
      name: name,
      password: password
    });
  }

  login(name, password) {
    return this.sClient.request('auth/login', {
      name: name,
      password: password
    });
  }

  getCurrentUser() {
    if(this.isAttached())
      return this.sClient.getTag('currentUser');
  }
}

export default new AuthSapiModule();
