import { getOwner } from '@ember/application';
import { set } from '@ember/object';
import Service from '@ember/service';
import hydrate from '../-private/hydrate';
import { extractIntPart, isLessThanBoundary, normalizeNumber } from '../-private/math-utils';
import { findLocaleData, needsFormatting, normalizeLocal, replaceNumber } from '../-private/utils';

export default Service.extend({
  __localeData__: null,
  __config__: null,

  /**
   * Percentage from upper limit to consider using upper limit rules
   * e.g. 950,000 is within 95% of upper limit of 1,000,000.  Thus use 1M abbreviation
   * rules
   *
   * @property threshold
   * @default 0.05
   */
  threshold: 0.05,

  init() {
    this._super(...arguments);

    let userConfig = getOwner(this).resolveRegistration('config:environment');
    let addonConfig = userConfig['ember-short-number'];

    if (addonConfig) {
      set(this, '__config__', addonConfig);
      if (addonConfig['threshold']) {
        set(this, 'threshold', addonConfig['threshold']);
      }
    }

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
   * extracts one rule for a given language:
   * e.g.
   *  rule = [
   *    [1000, {one: ["0K", 1], other: ["0K", 1]}],
   *    [10000, {one: ["00K", 2], other: ["00K", 2]}]
   *  ]
   *
   * @method format
   * @param {String|Number} value
   * @param {String} [locale='en'] this is the language code as specified by ISO 639-1
   * @param {Object} digitsConfig
   * @return {String}
   */
  format(value, locale = 'en', digitsConfig = {}) {
    // coerce to number
    let number = Number(value);
    if (!value || typeof number !== 'number') {
      return value;
    }

    // figure out which numbers hash based on the locale
    locale = normalizeLocal(locale); // en_GB -> en-GB
    let localeData = findLocaleData(this.__localeData__, locale);
    if (!localeData) {
      return value;
    }

    // take the absolute value and stash sign to apply at end
    let sign = 1;
    if (number < 0) {
      sign = -1;
      number = Math.abs(number);
    }

    // find specific rules: short or long
    let { financialFormat = false, long = false } = digitsConfig;
    let rules = long ? localeData.decimal.long : localeData.decimal.short;
    if (!rules || number < 1000) {
      return value;
    }

    // 1. Take number and determine range it is in
    // 2. Extract specific rule from hash - ["0K", 1] meaning which value from the rule and number of zeros
    let matchingRule;
    let arbitraryPrecision = 0;
    for (let i = 0; i <= rules.length; i++) {
      if (isLessThanBoundary(number, rules[i][0])) {

        let [testRangeHigh] = rules[i];
        // always use previous rule until within 5% threshold of upper limit
        if (!financialFormat && (1 - (number / testRangeHigh) > this.threshold)) {
          // e.g use 950K instead of 1M
          // e.g use 101K instead of 0.1M
          matchingRule = rules[i - 1];
        } else {
          matchingRule = rules[i];
          if (!digitsConfig.significantDigits || !financialFormat) {
            // if we want to round up, we need to prevent numbers like 99,499 from rounding down to 99K
            // /-private/math-utils will use this variable to round a number like 91 to 100 since we are within the threshold
            arbitraryPrecision = 1;
          }
        }
        break;
      }
    }

    // 3. Normalise number by converting to decimal and cropping to number of digits
    //  1000 -> 1.000 -> 1K
    //  1600 -> 1.600 -> 2K
    // 4. Format according to formatter e.g. "0K"
    let [range, opts] = matchingRule;
    // cldr data is either `one` or `other`.  Defaulting to `one` for now
    let [format, numberOfDigits] = opts.one || opts.other;

    if (!needsFormatting(format)) {
      return value;
    }

    let normalized = normalizeNumber(
      extractIntPart(number, range, numberOfDigits),
      arbitraryPrecision,
      sign,
      locale,
      digitsConfig
    );

    return replaceNumber(normalized, format);
  }
});

