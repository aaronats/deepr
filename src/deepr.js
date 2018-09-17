const {
  isObject,
  isArray,
  isString,
  isMatch
} = require('./utils');

const merge = (prev, next) => {
  if (!next) return prev;
  if (isObject(next)) return mergeObject(prev, next);
  if (isArray(next)) return mergeArray(prev, next);
  return next;
}

const mergeArray = (prev, next) => {
  if (isArray(prev)) {
    if (isArray(next)) {
      if (isString(next[0])) {
        switch (true) {
          case isMatch(next[0], /&push/):
            prev.push(next[1]);
            return prev;
          case isMatch(next[0], /&concat/):
            return prev.concat(next[1]);
          case isMatch(next[0], /&pop/):
            prev.pop();
            return prev;
          case isMatch(next[0], /&shift/):
            prev.shift();
            return prev;
          case isMatch(next[0], /&unshift/):
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
    if (isObject(next[key]) || isArray(next[key])) {
      if (isArray(prev[key])) {
        prev[key] = prev[key] ? mergeArray(prev[key], next[key]) : next[key];
      }
      if (isObject(next[key])) {
        prev[key] = prev[key] ? mergeObject(prev[key], next[key]) : next[key];
      }
    } else {
      if (isString(next[key])) {
        switch (true) {
          case isMatch(next[key], /&delete/):
            delete prev[key];
            break;
          case isMatch(next[key], /&={}/):
            prev[key] = {};
            break;
          case isMatch(next[key], /&=\[\]/):
            prev[key] = [];
            break;
          case isMatch(next[key], /&\+=/):
            prev[key] = (prev[key] || 0) + Number(next[key].split('=')[1]);
            break;
          case isMatch(next[key], /&\-=/):
            prev[key] = (prev[key] || 0) - Number(next[key].split('=')[1]);
            break;
          case isMatch(next[key], /&\*=/):
            prev[key] = (prev[key] || 0) * Number(next[key].split('=')[1]);
            break;
          case isMatch(next[key], /&\/=/):
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

module.exports = merge;
