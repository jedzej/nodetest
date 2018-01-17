var __objectId__ = 0;
module.exports = o => {
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
