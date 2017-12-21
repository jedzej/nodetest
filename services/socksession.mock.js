const EventEmitter = require('events').EventEmitter;
const crypto = require('socksession');


module.exports = {
  connect : function(address){
    return new WebSocket(address);
  }
};
