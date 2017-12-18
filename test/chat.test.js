var assert = require('assert');
const chat = require('../services/chat');
 
describe('Chat', function() {

  it('should create and be getable', function(){
    var c = chat.create("1234");
    assert.ok(c == chat.get("1234"));
  });

  it('should emit events on message/join/leave', function(done){
    var c = chat.get("1234");

    c.on('join', function(accountId){
      // step 2 - join user1 callback -> leave user1
      if(accountId == 'user1')
        c.leave(accountId);
      // step 4 - join user2 callback -> message
      else if(accountId == 'user2')
        c.message(accountId,"msg")
      else
        assert.fail();
    });

    // step 3 - leave user1 callback -> join user2
    c.on('leave', function(accountId){
      assert.equal(accountId, 'user1');
      c.join('user2');
    });

    // step 5 - message
    c.on('message', function(senderId, message){
      assert.equal(senderId, 'user2');
      assert.equal(message, 'msg');
      // step 6 - done
      done();
    });
    // step 1 - join
    c.join('user1');
  });
});
