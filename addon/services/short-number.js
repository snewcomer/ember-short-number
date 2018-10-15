import Service from '@ember/service';
import { getOwner } from '@ember/application';
import hydrate from '../-private/hydrate';
import toLocaleFixed from '../-private/to-locale-fixed';

export default Service.extend({
  __localeData__: null,

  /**
   * Percentage from upper limit to consider using upper limit rules
   * e.g. 950,000 is within 95% of upper limit of 1,000,000.  Thus use 1M abbreviation
   * rules
   *
   * @property threshold
   * @default 0.05
   */
  threshold: 0.05,

  /**
   * Assumes, for a number 101,000, you want to show 101K
   * Set to true on service if you want to show 0.1M
   *
   * @property alwaysUseUpperLimit
   * @default false
   */
  alwaysUseUpperLimit: false,

  init() {
    this._super(...arguments);

    this.__localeData__ = {};
    hydrate(this, getOwner(this));
  },

  /**
   * @method addLocaleData
   * @param {Object} data
   */
  addLocaleData(data) {
    this.__localeData__[data.locale.toLowerCase()] = data;
  },

  /**
   * digitsConfig accepts 3 possiblearguments
   *  - significantDigits
   *  - minimumFractionDigits
   *  - maximumFractionDigits
   *
   * @method formatNumber
   * @param {String|Number} value
   * @param {String} [locale='en'] this is the language code as specified by ISO 639-1
   * @param {Object} digitsConfig
   * @return {String}
   */
  formatNumber(value, locale = 'en', digitsConfig = {}) {
    if (!value) {
      return value;
    }

    // coerce to number
    let number = Number(value);

    let sign = 1;
    if (number < 0) {
      sign = -1;
    }

    number = Math.abs(number);
    let rules = this.__localeData__[locale] ? this.__localeData__[locale].numbers.decimal.short : null;

    if (!rules || number < 1000) {
      return value;
    }

    // rules = [
    //   [1000, {one: ["0K", 1], other: ["0K", 1]}],
    //   [10000, {one: ["00K", 2], other: ["00K", 2]}]
    // ]

    // 1. Take value and determine range it is in - e.g. 1000 for 1765
    // 2. Extract specific rule from hash - ["0K", 1] meaning which value from the rule and number of zeros
    let matchingRule;
    for (let i = 0; i <= rules.length; i++) {
      if (isLessThanBoundary(number, rules[i][0])) {

        let [testRangeHigh] = rules[i];
        // always use previous rule until within 5% threshold of upper limit
        // @TODO threshold configurable
        if (!this.alwaysUseUpperLimit && (1 - (number / testRangeHigh) > this.threshold)) {
          // e.g use 950K instead of 1M
          // e.g use 101K instead of 0.1M
          matchingRule = rules[i - 1];
        } else {
          matchingRule = rules[i];
        }
        break;
      }
    }

    // 3. Normalise number by converting to decimal and cropping to number of digits
    //  1000 -> 1.000 -> 1K
    //  1600 -> 1.600 -> 2K
    // 4. Format according to formatter e.g. "0K"
    let [range, opts] = matchingRule;
    // cldr data is either `one` or `other`
    let [format, numberOfDigits] = opts.one || opts.other;
    let normalized = normalizeNumber(extractIntPart(number, range, numberOfDigits), range, numberOfDigits, sign, locale, digitsConfig);

    return replaceNumber(normalized, format);
  }
});

function isLessThanBoundary(number, boundary) {
  if (number <= boundary) {
    return true;
  }
  return false;
}

/**
 * @method extractIntPart
 * @return {Decimal}
 */
function extractIntPart(number, range, numberOfDigits) {
  // 1734 -> 1.734
  // 17345 -> 17.345
  // 999949 -> 999.9K with one significant digit or 999,9 mil in Spanish
  // this gives us the "int" (LHS) part of the number with the remains on the RHS
  return number / (range / Math.pow(10, numberOfDigits - 1));
}

/**
 * Meant to either localize a number with a Decimal or return an Integer
 * localization accepts 3 arguments
 *  - significantDigits
 *  - minimumFractionDigits
 *  - maximumFractionDigits
 *
 * @method normalizeNumber
 * @return {String|Integer}
 */
function normalizeNumber(decimal, range, numberOfDigits, sign, locale, { significantDigits = 0, minimumFractionDigits = 0, maximumFractionDigits = 2 }) {
  if (significantDigits) {
    // String
    return toLocaleFixed(toFixed(decimal, significantDigits), locale, { minimumFractionDigits, maximumFractionDigits });
  }

  // Integer
  return Math.round(decimal) * sign;
}

function toFixed(decimal, significantDigits) {
  // solves issues with toFixed returning a string
  // e.g. 999.94 -> 999.9
  // e.g. 999.95 -> 1000 instead of (999.95).toFixed(1) -> '1000.1'
  return Math.round(decimal * Math.pow(10, significantDigits)) / Math.pow(10, significantDigits);
}

function replaceNumber(number, format) {
  // 1.734 -> 1K
  // replace 0's with absolute number while preserving space and remaining text
  // return format.replace(/0*(\s*)(\w+)/, Math.round(number) + '$1$2');
  return format.replace(/0*/, number);
}

