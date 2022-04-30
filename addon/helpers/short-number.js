import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default class ShortNumberHelper extends Helper {
  @service shortNumber;

  compute([number, lang], digitsConfig) {
    return this.shortNumber.format(number, lang, digitsConfig);
  }
}

