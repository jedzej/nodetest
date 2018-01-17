const crypto = require('crypto');
const SapiError = require('../sapi').SapiError;


module.exports.Context = class Context {
  store(field) {
    return (data) => {
      var top = this;
      var splitted = field.split('.');
      splitted.slice(0, -1).forEach(element => {
        if (top[element] == undefined)
          top[element] = new Object();
        top = top[element];
      });
      top[splitted.slice(-1)] = data
      return Promise.resolve(data);
    }
  }
}


module.exports.logThrough = (msg, loggingFun) => arg => {
  if (loggingFun == undefined) {
    loggingFun = console.log
  }
  loggingFun(msg);
  return Promise.resolve(arg)
}


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


module.exports.error = (msg, code) => new SapiError(msg, code);


module.exports.rejectionAction = (type, err) => {
  if (typeof err === 'string') {
    err = new SapiError(err, "EUNKNOWN");
  }
  return ({
    type: type,
    payload: SapiError.from(err, err.code).toPayload()
  })
};


module.exports.verify = (cond, err) => (data) => {
  return new Promise((resolve, reject) => {
    //    console.log("Verification: ", cond, err)
    if (typeof cond == 'function')
      cond = cond(data);
    if (cond) {
      resolve(data);
    } else {
      reject(err);
    }
  });
}


var __objectId__ = 0;
module.exports.objectId = o => {
  if (typeof o.__uniqueid == "undefined") {
    Object.defineProperty(o, "__uniqueid", {
      value: ++__objectId__,
      enumerable: false,
      // This could go either way, depending on your 
      // interpretation of what an "id" is
      writable: false
    });
  }
  return o.__uniqueid;
};
