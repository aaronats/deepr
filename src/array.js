const { isObject } = require('./utils');

const mutableMerge = (prev, next) => {
  const [arg, val] = next;
  switch (true) {
    case /&push/.test(arg):
      prev.push(val);
      break;
    case /&concat/.test(arg):
      prev = prev.concat(val);
      break;
    case /&pop/.test(arg):
      prev.pop();
      break;
    case /&slice/.test(arg):
      prev = prev.slice(...val);
      break;
    case /&shift/.test(arg):
      prev.shift();
      break;
    case /&unshift/.test(arg):
      prev.unshift(val);
      break;
    case /&reverse/.test(arg):
      prev.reverse();
      break;
    default:
      return next;
  }
  return prev;
}

const immutableMerge = (prev, next) => {
  const [arg, val] = next;
  switch (true) {
    case /&push/.test(arg):
      return [ ...prev, val ];
    case /&concat/.test(arg):
      return prev.concat(val);
    case /&pop/.test(arg):
      return prev.slice(0, -1)   
    case /&shift/.test(arg):
      prev = prev.slice(1);
      break;
    case /&unshift/.test(arg):
      prev = [ val, ...prev ];
      break;
    case /&slice/.test(arg):
      prev = prev.slice(...val);
      break;
    case /&reverse/.test(arg):
      prev = [ ...prev ].reverse();
      break;
    default:
      return next;
  }
  return prev;
}

// TODO: add remove by function
// const removeBy = (arr, cond) => {
//   if (!isObject(cond)) return;
//   if (!cond.key || !cond.vals || !isArray(cond.vals)) return;
//   cond.vals.forEach((val) => {
//     const idx = arr.findIndex(obj => obj[cond.key] === val);
//     if (idx !== -1) {
//       arr.splice(idx, 1);
//     }
//   });
// }


module.exports = { mutableMerge, immutableMerge };