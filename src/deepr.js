const utils = require('./utils');
const array = require('./array');
const { validateObject } = require('./validate');
const { ARRAY, OBJECT, STRING } = require('./constants');

const mergePrimative = (prev, next) => {
  const type = utils.getType(prev);
  switch (type) {
    case ARRAY:
      return prev;
    case OBJECT:
      return prev;
    default:
      return next;
  }
};

const mergeArray = (prev, next, clone) => {
  if (prev && utils.isArray(prev)) {
    if (utils.isString(next[0])) {
      if (clone) {
        return array.immutableMerge(prev, next);
      }
      return array.mutableMerge(prev, next);
    }
    return next;
  }
  return mergePrimative(prev, next);
}

const mergeObject = (prev, next, clone) => {
  const state = clone ? Object.assign({}, prev) : prev;
  Object.keys(next).forEach(key => {
    const val = next[key];
    const type = utils.getType(val);
    switch (type) {
      case ARRAY:
        if (/&=/.test(val[0])) {
          state[key] = val[1];
          break;
        }
        state[key] = mergeArray(state[key] || [], val, clone);
        break;
      case OBJECT:
        state[key] = mergeObject(state[key] || {}, val, clone);
        break;
      case STRING:
        switch (true) {
          case /&delete/.test(val):
            delete state[key];
            break;
          case /&={}/.test(val):
            state[key] = {};
            break;
          case /&=\[\]/.test(val):
            state[key] = [];
            break;
          case /&=null/.test(val):
            state[key] = null;
            break;
          case /&\+=./.test(val):
            state[key] = (state[key] || 0) + Number(val.split('=')[1]);
            break;
          case /&-=./.test(val):
            state[key] = (state[key] || 0) - Number(val.split('=')[1]);
            break;
          case /&\*=./.test(val):
            state[key] = (state[key] || 0) * Number(val.split('=')[1]);
            break;
          case /&\/=./.test(val):
            state[key] = (state[key] || 0) / Number(val.split('=')[1]);
            break;
          default:
            state[key] = mergePrimative(state[key], val);
        }
        break;
      default:
        state[key] = mergePrimative(state[key], val);
        break;
    }
  });
  return state;
}

const merge = (prev, next, clone = false) => {
  if (!next) return prev;
  const type = utils.getType(next);
  if (clone && type !== ARRAY) {
    prev = Object.assign({}, prev);
  }
  switch (type) {
    case ARRAY:
      return mergeArray(prev, next, clone);
    case OBJECT:
      return mergeObject(prev, next, clone);
    default:
      return mergePrimative(prev, next);
  }
}

const validate = (change, policy) => {
  const errors = [];
  validateObject(change, policy, errors);
  return { valid: errors.length === 0, errors }
};

module.exports = { merge, validate };
