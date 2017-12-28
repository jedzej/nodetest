import SapiModule from './SapiModule'

class CoreSapiModule extends SapiModule {
  hello() {
    return this.sClient.request('hello');
  }
}

export default new CoreSapiModule();