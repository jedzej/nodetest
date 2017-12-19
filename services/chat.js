var express = require('express');
var EventEmitter = require('events')
var router = express.Router();

var chats = {};

class Chat extends EventEmitter {

  constructor(id) {
    super();
    this.id = id;
    this.members = [];
  }

  message(accountId, message) {
    if (this.hasMember(accountId) == false)
      throw new Error(accountId + " is not a member!");
    this.emit('message', accountId, message);
  }

  hasMember(accountId) {
    return this.members.some((m) => m == accountId);
  }

  join(accountId) {
    if (this.hasMember(accountId))
      throw new Error(accountId + " is already a member!");
    this.members.push(accountId);
    this.emit('join', accountId);
  }

  leave(accountId) {
    if (this.hasMember(accountId) == false)
      throw new Error(accountId + " is not a member!");
    this.members.push(accountId);
    this.members = this.members.filter((e) => e != accountId);
    this.emit('leave', accountId);
  }

  destroy() {
    if (this.hasMember(accountId) == false)
      throw new Error("Already destroyed!");
    delete chats[this.id];
    this.emit('destroy', accountId);
  }
}

function get(id) {
  return chats[id];
}

function create(id) {
  if (get(id) != undefined)
    throw new Error("Already exists")
  chats[id] = new Chat(id);
  return chats[id];
}


module.exports = {
  'get': get,
  'create': create
};
