import { getOwner } from '@ember/application';
import { set } from '@ember/object';
import Service from '@ember/service';
import hydrate from '../-private/hydrate';
import CompactNumber from 'cldr-compact-number';

export default class ShortNumberService extends Service {
  __localeData__ = null;
  __config__ = null;

  /**
   * Percentage from upper limit to consider using upper limit rules
   * e.g. 950,000 is within 95% of upper limit of 1,000,000.  Thus use 1M abbreviation
   * rules
   *
   * @property threshold
   * @default 0.05
   */
  threshold = 0.05;

  init() {
    super.init(...arguments);

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
  }

  /**
   * @method addLocaleData
   * @param {Object} data
   */
  addLocaleData(data) {
    this.__localeData__[data.locale.toLowerCase()] = data;
  }

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
    const options = Object.assign({}, { threshold: this.threshold }, digitsConfig);
    return CompactNumber(value, locale, this.__localeData__, options)
  }
}

