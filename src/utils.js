module.exports = {
  isArray: (obj) => {
    return (!!obj) && ( obj.constructor === Array );
  },
  isObject: (obj) => {
    return (!!obj) && ( obj.constructor === Object );
  },
  isString: (obj) => {
    return (!!obj) && ( obj.constructor === String );
  },
  isMatch: (str, regex) => {
    return regex.test(str);
  },
  isEmptyObject: (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  },
  isEmptyArray: (obj) => {
    return obj.length === 0 && obj.constructor === Array;
  }
}
