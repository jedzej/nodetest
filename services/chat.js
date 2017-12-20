var EventEmitter = require('events')

var chats = {};

class Chat extends EventEmitter {

  constructor(id) {
    super();
    this.id = id;
    this.members = [];
  }

  _emitAndLog(){
    console.info("Chat: " + Array.from(arguments));
    this.emit.apply(this, arguments);
  }

  message(accountId, message) {
    if (this.hasMember(accountId) == false)
      throw new Error(accountId + " is not a member!");
    this._emitAndLog('message', accountId, message);
  }

  hasMember(accountId) {
    return this.members.some((m) => m == accountId);
  }

  join(accountId) {
    if (this.hasMember(accountId))
      throw new Error(accountId + " is already a member!");
    this.members.push(accountId);
    this._emitAndLog('join', accountId);
  }

  leave(accountId) {
    if (this.hasMember(accountId) == false)
      throw new Error(accountId + " is not a member!");
    this.members = this.members.filter((e) => e != accountId);
    this._emitAndLog('leave', accountId);
  }

  destroy() {
    if (this.hasMember(accountId) == false)
      throw new Error("Already destroyed!");
    delete chats[this.id];
    this._emitAndLog('destroy', accountId);
  }
}

function get(id) {
  return chats[id];
}

function create(id) {
  if (get(id) != undefined)
    throw new Error("Already exists")
  chats[id] = new Chat(id);
  chats[id]._emitAndLog('create');
  return chats[id];
}


module.exports = {
  'get': get,
  'create': create
};
