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
    let formattedNumber = service.format(234, 'en');
    assert.equal(formattedNumber, 234);
  });

  test('it does format number greater than 1000', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format(1234, 'en');
    assert.equal(formattedNumber, '1K');
  });

  test('it does format 1B', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format(1000000000, 'en');
    assert.equal(formattedNumber, '1B');
  });

  test('it does format 1B in ja', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format(1000000000, 'ja');
    assert.equal(formattedNumber, '10億');
  });

  test('it defaults locale to en', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format(1234);
    assert.equal(formattedNumber, '1K');
  });

  test('it doesnt format if no value', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format(null);
    assert.equal(formattedNumber, null);
  });

  test('it accepts a string', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format('1234', 'en');
    assert.equal(formattedNumber, '1K');
  });

  test('it accepts a language-Region format', function(assert) {
    let service = this.owner.lookup('service:short-number');
    let formattedNumber = service.format('1234', 'en-GB');
    assert.equal(formattedNumber, '1K');

    formattedNumber = service.format('1234', 'en_GB');
    assert.equal(formattedNumber, '1K');

    formattedNumber = service.format('1234', 'en_xx');
    assert.equal(formattedNumber, '1234', 'it doesnt format if lang not found');
  });
});
