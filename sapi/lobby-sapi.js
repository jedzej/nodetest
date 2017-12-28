var lobby = require('../services/lobby');
var auth = require('../services/auth');
var tools = require('../services/tools');
var socksession = require('../services/socksession');


module.exports.client = {

  create: function (sClient) {
    return sClient.request('lobby/create')
      .then(function resolve(event) {
        return Promise.resolve(event.lobbyId);
      });
  },

  join: function (sClient, lobbyId) {
    const data = { lobbyId: lobbyId };

    return sClient.request('lobby/join', data)
      .then(function resolve(event) {
        return Promise.resolve(event.lobbyId);
      });
  }
}

module.exports.server = {

  'lobby/create/request': function (event) {
    var userId = this.getCurrentUser();
    var _this = this;
    if (userId) {
      var lobbyInstance = lobby.create(userId, function (err, lobby) {
        if (err) {
          _this.send({
            event: "lobby/create/error",
            error: err.code
          });
        } else {
          _this.send({ event: "lobby/create/response" });
          _this.send({
            event: "lobby/update",
            id: lobby.id,
            members: lobby.members
          });
        }
      });
    }
  },

  'lobby/join/request': function (event) {
    var userId = tools.loggedInOrDie(this, "lobby/join/error");
    if (userId) {
      var lobbyInstance = lobby.get(event.lobbyId);
      if (lobbyInstance == undefined) {
        this.send({ event: 'lobby/join/error' });
      } else {
        lobbyInstance.join(userId, function (err, lobby) {
          if (err) {
            this.send({
              event: "lobby/join/error",
              error: err.code
            });
          } else {
            lobby.get()
            this.send({
              event: "lobby/join/response"
            });
          }
        });
      }
    }
  },

  'lobby/update/request': function (event) {
    var userId = this.getCurrentUser();
    var _this = this;
    if (userId) {
      var lobbyInstance = lobby.getLobbyFor(userId);
      if (lobbyInstance === undefined) {
        _this.send({
          event: "lobby/update",
          id: undefined,
          members: undefined
        });
      } else {
        _this.send({
          event: "lobby/update",
          id: lobbyInstance.id,
          members: lobbyInstance.members
        });
      }
    }
  },

  'lobby/list/request': function (event) {

  },

  'lobby/leave/request': function (event) {

  },

  'lobby/invite/request': function (event) {

  },

  'timeout': function () {

  },

  'error': function (err) {

  },

  'close': function (code, reason) {

  }
};