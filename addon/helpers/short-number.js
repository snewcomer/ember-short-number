import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class ShortNumberHelper extends Helper {
  @service shortNumber;

  compute([number, lang], digitsConfig) {
    return this.shortNumber.format(number, lang, digitsConfig);
  }
}

