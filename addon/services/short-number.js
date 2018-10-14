import Service from '@ember/service';
import { getOwner } from '@ember/application';
// import { set } from '@ember/object';
import hydrate from '../-private/hydrate';

export default Service.extend({
  __localeData__: null,

  init() {
    this._super();

    this._owner = getOwner(this);

    this.__localeData__ = {};
    hydrate(this, this._owner);
  },

  /**
   * @method addLocaleData
   * @param {Object} data
   */
  addLocaleData(data) {
    this.__localeData__[data.locale.toLowerCase()] = data;
  },

  /**
   * @method formatNumber
   * @param {String|Number} value
   * @param {String} locale
   * @return {Number}
   */
  formatNumber(value, locale) {
    // coerce to number
    let number = Number(value);

    let sign = 1;
    if (number < 0) {
      sign = -1;
    }

    number = Math.abs(number);

    if (number < 1000) {
      return value;
    }

    let rules = this.__localeData__[locale] ? this.__localeData__[locale].numbers.decimal.short : null;

    if (!rules) {
      return value;
    }

    // matchingRules = [
    //   [1000, {one: ["0K", 1], other: ["0K", 1]}],
    //   [10000, %{one: ["00K", 2], other: ["00K", 2]}]
    // ]

    // 1. Take value and determine range it is in - e.g. 1000 for 1765
    // 2. Extract specific rule from hash - ["0K", 1] meaning which value from the rule and number of zeros
    let matchingRule;
    for (let i = 0; i <= rules.length; i++) {
      if (isLessThanBoundary(number, rules[i][0])) {
        matchingRule = rules[i];
        break;
      }
    }

    // 3. Normalise number by converting to decimal and cropping to number of digits
    // 22 -> 22
    // 1000 -> 1.000 -> 1K
    // 1600 -> 1.600 -> 2K
    // 1600.9 -> 1.600 -> 2K
    // 1,000,543 -> 1.000.543 -> 1M
    // 4. Format according to formatter e.g. "0K"
    let range = matchingRule[0];
    let opts = matchingRule[1];
    let format = opts.one[0];
    let numberOfDigits = opts.one[1];
    let normalized = normalizeNumber(number, range, numberOfDigits);

    return formatNumber(normalized * sign, format);
  }
});

function isLessThanBoundary(number, boundary) {
  if (number <= boundary) {
    return true;
  }
  return false;
}

function normalizeNumber(number, range, numberOfDigits) {
  // 1734 -> 1.734
  // 17345 -> 17.345
  return number / (range / Math.pow(10, numberOfDigits - 1));
}

function formatNumber(number, format) {
  // 1.734 -> 1K
  return format.replace(/0*(\s*)(\w+)/, Math.round(number) + '$1$2');
}
