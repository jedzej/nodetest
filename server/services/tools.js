const crypto = require('crypto');


module.exports.genUniqueToken = function (callback) {
  crypto.randomBytes(48, function (err, buffer) {
    if (err) {
      callback(err);
    } else {
      var token = buffer.toString('hex');
      callback(null, token);
    }
  });
}

module.exports.loggedInOrDie = function(sClient, event){
  var userId = sClient.getCurrentUser();
  if(userId == undefined){
    sClient.send({
      event: event,
      error: {
        message: "Not logged in!",
        code: "ENOTLOGGEDIN"
      }
    });
  }
  return userId;
}