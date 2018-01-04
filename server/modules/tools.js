const crypto = require('crypto');
const SapiError = require('../sapi').SapiError;

module.exports.genUniqueToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, function (err, buffer) {
      if (err) {
        reject(err);
      } else {
        var token = buffer.toString('hex');
        resolve(token);
      }
    });
  });
}


module.exports.filterLobbyMembers = lobby => ws => ws.store.lobbyId ? ws.store.lobbyId.equals(lobby._id) : false


module.exports.verify = (cond, err) => () => {
  return new Promise((resolve, reject) => {
    if (typeof cond == 'function')
      cond = cond();
    if (cond) {
      resolve();
    } else {
      reject(err);
    }
  });
}
