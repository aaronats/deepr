const utils = require('./utils');
const { OBJECT } = require('./constants');

const isDestructive = (val) => {
  const input = utils.isArray(val) ? val[0] : val;
  if (!utils.isString(input)) return false;
  switch (true) {
    case /&delete/.test(input):
      return true;
    case /&={}/.test(input):
      return true;
    case /&=\[\]/.test(input):
      return true;
    default:
      return false;
  }
}

const validateObject = (obj, policy, errors, path = []) => {
  Object.keys(policy).forEach((key) => {
    const val = obj[key];
    const rules = policy[key];
    const type = utils.getType(val);
    switch (type) {
      case OBJECT:
        path.push(key);
        validateObject(val, rules, errors, path);
        break;
      default:
        if (utils.isArray(rules)) {
          rules.forEach((rule) => {
            const item = path.length ? `${path.join('.')}.${key}` : key;
            switch (rule) {
              case 'protected':
                if (isDestructive(val)) {
                  errors.push(`${item} is protected`);
                }
                break;
              case 'required':
                if (utils.isDefined(val) && utils.isEmpty(val)) {
                  errors.push(`${item} is required`);
                }
                break;
              default:
                // TODO: add rules here for email, etc.
            }
          });
        }
        break;
    }
  });
}

module.exports = { validateObject };