const crypto = require('crypto');


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


module.exports.waitForAction = (ws, expected) => {
  return new Promise((resolve, reject) => {
    const trigger = () => {
      const action = JSON.parse(ws.buffer.pop());
      if (expected) {
        if (action.type == expected) {
          resolve(action);
        } else {
          reject(action);
        }
      } else {
        resolve(action);
      }
    };
    if (ws.buffer.length > 0) {
      trigger();
    } else {
      ws.once('message', event => {
        trigger();
      })
    }
  });
}


module.exports.sendAction = (ws, action) => {
  return new Promise((resolve, reject) => {
    ws.send(JSON.stringify(action));
    resolve();
  })
}