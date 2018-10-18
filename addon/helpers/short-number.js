import Helper from '@ember/component/helper';
import { inject } from '@ember/service';
import { get } from '@ember/object';

export default Helper.extend({
  shortNumber: inject(),

  compute([number, lang], digitsConfig) {
    return get(this, 'shortNumber').format(number, lang, digitsConfig);
  }
});

