import EventEmitter from 'events';


export default class SapiModule extends EventEmitter {

  attach(sClient) {
    this.sClient = sClient;
    this.emit('attach');
  }

  isAttached() {
    return this.sClient !== undefined;
  }
}