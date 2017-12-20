var chat = require('../services/chat');

module.exports = {

  'chat/create/request': function (event) {
    try {
      var chatInstance = chat.create(event.chatId);
      this.send({
        event: "chat/create/response",
        chatId: chatInstance.id
      });
    } catch (e) {
      this.send({
        event: "chat/create/error",
        error: e.message
      });
    }
  },

  'chat/join/request': function (event) {
    var chatInstance = chat.get(event.chatId);
    if (chatInstance.hasMember(event.accountId) == false)
      chatInstance.join(event.accountId);
    this.accountId = event.accountId;
    this.chatId = event.chatId;
    var _this = this;

    chatInstance.on('message', function (accountId, message) {
      _this.send({
        event: "chat/message/notify",
        accountId: accountId,
        message: message
      });
    });

    chatInstance.on('leave', function (accountId) {
      _this.send({
        event: "chat/leave/notify",
        accountId: accountId
      });
    });

    chatInstance.on('join', function (accountId) {
      _this.send({
        event: "chat/join/notify",
        accountId: accountId
      });
    });

    this.send({ event: 'chat/join/response' });
  },

  'chat/leave/request': function (event) {
    var chatInstance = chat.get(event.chatId);
    chatInstance.leave(this.accountId);
  },

  'chat/message/request': function (event) {
    var chatInstance = chat.get(this.chatId);
    chatInstance.message(this.accountId, event.message);
  },

  'timeout' : function() {

  },

  'error': function (err) {
    switch(err.code){
      case 'ECONNRESET':
        var chatInstance = chat.get(this.chatId);
        if (chatInstance != undefined)
          chatInstance.leave(this.accountId);
        this.chatId = undefined;
        this.accountId = undefined;
        break;
      case 'ENOTPARSED':
        console.log(err);
        break;
      default:
        console.log(err);
        break;
    }
  },

  'close':function(code, reason){
    var chatInstance = chat.get(this.chatId);
    if (chatInstance != undefined)
      chatInstance.leave(this.accountId);
    this.chatId = undefined;
    this.accountId = undefined;
  }
};