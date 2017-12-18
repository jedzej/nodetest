var express = require('express');
var EventEmitter = require('events')
var router = express.Router();

var chats = {};

class Chat extends EventEmitter {

  constructor() {
    super();
    this.members = [];
  }

  message(accountId, message) {
    if (!this.hasMember(accountId))
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
    if (!this.hasMember(accountId))
      throw new Error(accountId + " is not a member!");
    this.members.push(accountId);
    this.members = this.members.filter((e) => e != accountId);
    this.emit('leave', accountId);
  }
}

function get(id) {
  return chats[id];
}

function create(id) {
  if (get(id) == undefined) {
    chats[id] = new Chat();
  }
  return chats[id];
}


module.exports = {
  'get': get,
  'create': create
};
