import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | short-number', function(hooks) {
  setupTest(hooks);

  test('it adds locale', function(assert) {
    let service = this.owner.lookup('service:short-number');
    service.addLocaleData({ locale: 'en' });
    assert.equal(service.__localeData__.en.locale, 'en');
  });

  test('it lower cases locale', function(assert) {
    let service = this.owner.lookup('service:short-number');
    service.addLocaleData({ locale: 'En' });
    assert.equal(service.__localeData__.en.locale, 'En');
  });

  test('it does not format number less than 1000', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.formatNumber(234, 'en');
    assert.equal(formattedNumber, 234);
  });

  test('it does format number greater than 1000', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.formatNumber(1234, 'en');
    assert.equal(formattedNumber, '1K');
  });

  test('it accepts a string', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.formatNumber('1234', 'en');
    assert.equal(formattedNumber, '1K');
  });
});
