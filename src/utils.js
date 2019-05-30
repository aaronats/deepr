const { ARRAY, OBJECT, STRING } = require('./constants');

const getType = (val) => {
  return Object.prototype.toString.call(val);
};

const isObject = (val) => {
  return getType(val) === OBJECT;
};

const isArray = (val) => {
  return getType(val) === ARRAY;
};

const isString = (val) => {
  return getType(val) === STRING;
};

const isDefined = (val) => {
  return typeof val !== undefined;
};

const isEmpty = (val) => {
  const type = getType(val);
  switch (type) {
    case ARRAY:
    case STRING:
      return val.length === 0;
    case OBJECT:
      return Object.keys(val).length === 0;
    default:
      return !val;
  }
};

module.exports = {
  getType,
  isArray,
  isEmpty,
  isString,
  isObject,
  isDefined
};