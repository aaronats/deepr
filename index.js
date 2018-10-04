const is = require('is');

const merge = (prev, next) => {
  if (!next) return prev;
  if (is.object(next)) return mergeObject(prev, next);
  if (is.array(next)) return mergeArray(prev, next);
  return next;
}

const mergeArray = (prev, next) => {
  if (is.array(prev)) {
    if (is.array(next)) {
      if (is.string(next[0])) {
        switch (true) {
          case /&push/.test(next[0]):
            prev.push(next[1]);
            return prev;
          case /&concat/.test(next[0]):
            return prev.concat(next[1]);
          case /&pop/.test(next[0]):
            prev.pop();
            return prev;
          case /&shift/.test(next[0]):
            prev.shift();
            return prev;
          case /&unshift/.test(next[0]):
            prev.unshift(next[1]);
            return prev;
          default:
            return next;
        }
      }
    }
  }
  return next;
}

const mergeObject = (prev, next) => {
  Object.keys(next).forEach(key => {
    if (is.object(next[key]) || is.array(next[key])) {
      if (is.array(next[key])) {
        prev[key] = mergeArray(prev[key] || [], next[key]);
      }
      if (is.object(next[key])) {
        prev[key] = mergeObject(prev[key] || {}, next[key]);
      }
    } else {
      if (is.string(next[key])) {
        switch (true) {
          case /&delete/.test(next[key]):
            delete prev[key];
            break;
          case /&={}/.test(next[key]):
            prev[key] = {};
            break;
          case /&=\[\]/.test(next[key]):
            prev[key] = [];
            break;
          case /&\+=./.test(next[key]):
            prev[key] = (prev[key] || 0) + Number(next[key].split('=')[1]);
            break;
          case /&-=./.test(next[key]):
            prev[key] = (prev[key] || 0) - Number(next[key].split('=')[1]);
            break;
          case /&\*=./.test(next[key]):
            prev[key] = (prev[key] || 0) * Number(next[key].split('=')[1]);
            break;
          case /&\/=./.test(next[key]):
            prev[key] = (prev[key] || 0) / Number(next[key].split('=')[1]);
            break;
          default:
            prev[key] = next[key];
        }
      } else {
        prev[key] = next[key];
      }
    }
  });
  return prev;
}

const isDestructiveMethod = (val) => {
  if (!is.string(val)) return false;
  switch (true) {
    case /&delete/.test(val):
      return true;
    case /&={}/.test(val):
      return true;
    case /&=\[\]/.test(val):
      return true;
    default:
      return false;
  }
}

const isDestructive = (val) => {
  const method = is.array(val) ? val[0] : val;
  return isDestructiveMethod(method);
}

module.exports = { merge, isDestructive };
