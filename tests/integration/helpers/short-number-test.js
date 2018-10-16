import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

function replaceWhitespace(val) {
  return val.replace(/\s+/, ' ')
}

module('Integration | Helper | short-number', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders "en"', async function(assert) {
    await render(hbs`{{short-number 234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1K');

    await render(hbs`{{short-number 1234.23 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1K');

    await render(hbs`{{short-number 9499 "en"}}`);

    assert.equal(this.element.textContent.trim(), '9K', 'greater than 5% threshold');

    await render(hbs`{{short-number 9500 "en"}}`);

    assert.equal(this.element.textContent.trim(), '10K', 'less than 5% threshold');

    await render(hbs`{{short-number 19234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '19K');

    await render(hbs`{{short-number 99499 "en"}}`);

    assert.equal(this.element.textContent.trim(), '99K', 'greater than 5% threshold');

    await render(hbs`{{short-number 99500 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'less than 5% threshold');

    await render(hbs`{{short-number 99999 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'it rounds 999999 up');

    await render(hbs`{{short-number 100000 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K');

    await render(hbs`{{short-number 101000 "en"}}`, 'it does not round up to 1M');

    assert.equal(this.element.textContent.trim(), '101K');

    await render(hbs`{{short-number 500000 "en"}}`, 'it does not round up to 1M');

    assert.equal(this.element.textContent.trim(), '500K');

    await render(hbs`{{short-number 600000 "en"}}`, 'it does not round up to 1M');

    assert.equal(this.element.textContent.trim(), '600K');

    await render(hbs`{{short-number 949999 "en"}}`);

    assert.equal(this.element.textContent.trim(), '950K', 'greater than 5% threshold');

    await render(hbs`{{short-number 995000 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'less than 5% threshold');

    await render(hbs`{{short-number 999949 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1M', '999949 works');

    await render(hbs`{{short-number 999950 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1M', '999950 works');

    await render(hbs`{{short-number 11119234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '11M');

    await render(hbs`{{short-number "-19234" "en"}}`);

    assert.equal(this.element.textContent.trim(), '-19K');

    await render(hbs`{{short-number "-19234.9" "en"}}`);

    assert.equal(this.element.textContent.trim(), '-19K');
  });

  test('it renders "en" with significantDigits', async function(assert) {
    await render(hbs`{{short-number 1234 "en" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '1.2K');

    await render(hbs`{{short-number 99499 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '99.5K', 'greater than 5% threshold');

    await render(hbs`{{short-number 99500 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '99.5K', 'less than 5% threshold but still round');

    await render(hbs`{{short-number 99949 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '99.9K', 'less than 5% threshold but still round');

    await render(hbs`{{short-number 99950 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'less than 5% threshold but should round');

    await render(hbs`{{short-number 101000 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '101K');

    await render(hbs`{{short-number 192345 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '192.3K');

    await render(hbs`{{short-number 499999 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '500K');

    await render(hbs`{{short-number 501000 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '501K');

    await render(hbs`{{short-number 501200 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '501.2K');

    await render(hbs`{{short-number 501210 "en" significantDigits=2}}`);

    assert.equal(this.element.textContent.trim(), '501.21K', '2 significant digits');

    await render(hbs`{{short-number 949949 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '949.9K', 'greater than 5% threshold and does not round up');

    await render(hbs`{{short-number 949949 "en" significantDigits=2}}`);

    assert.equal(this.element.textContent.trim(), '949.95K', 'greater than 5% threshold and does not round up');

    await render(hbs`{{short-number 949999 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '950K', 'greater than 5% threshold');

    await render(hbs`{{short-number 995000 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'less than 5% threshold');

    await render(hbs`{{short-number 995100 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'less than 5% threshold');

    await render(hbs`{{short-number 999949 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', '999949 works');

    await render(hbs`{{short-number 999950 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', '999950 works');

    await render(hbs`{{short-number 999950 "en" significantDigits=2}}`);

    assert.equal(this.element.textContent.trim(), '1M');

    await render(hbs`{{short-number 1000000 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M');
  });

  test('it renders "es"', async function(assert) {
    await render(hbs`{{short-number 234 "es"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "es"}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '1 mil');

    await render(hbs`{{short-number 1234.23 "es"}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '1 mil');

    await render(hbs`{{short-number 19234 "es"}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '19 mil');

    await render(hbs`{{short-number 949949 "es" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '949,9 mil', 'greater than 5% threshold and does not round up');

    await render(hbs`{{short-number 949949 "es" significantDigits=2}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '949,95 mil', 'greater than 5% threshold and does not round up');

    await render(hbs`{{short-number 949999 "es" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '950 mil', 'greater than 5% threshold');

    await render(hbs`{{short-number 995000 "es" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '1 M', 'less than 5% threshold');

    await render(hbs`{{short-number 999949 "es" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '1 M');

    await render(hbs`{{short-number 11119234 "es"}}`);

    assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '11 M');

    await render(hbs`{{short-number "-19234" "es"}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '-19 mil');

    await render(hbs`{{short-number "-19234.9" "es"}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '-19 mil');
  });

  test('it renders "ks"', async function(assert) {
    await render(hbs`{{short-number 234 "ks"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "ks"}}`);

    assert.equal(this.element.textContent.trim(), '1K');

    await render(hbs`{{short-number 19234 "ks"}}`);

    assert.equal(this.element.textContent.trim(), '19K');

    await render(hbs`{{short-number 11119234 "ks"}}`);

    assert.equal(this.element.textContent.trim(), '11M');

    await render(hbs`{{short-number "-19234" "ks"}}`);

    assert.equal(this.element.textContent.trim(), '-19K');
  });

  test('it renders "fr"', async function(assert) {
    await render(hbs`{{short-number 234 "fr"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "fr"}}`);

    assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '1 k');

    await render(hbs`{{short-number 19234 "fr"}}`);

    assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '19 k');

    await render(hbs`{{short-number 11119234 "fr"}}`);

    assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '11 M');

    await render(hbs`{{short-number "-19234" "fr"}}`);

    assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '-19 k');
  });

  test('it renders "ja"', async function(assert) {
    await render(hbs`{{short-number 234 "ja"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "ja"}}`);

    assert.equal(this.element.textContent.trim(), '1');

    await render(hbs`{{short-number 11634 "ja" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1.2万');

    await render(hbs`{{short-number 19234 "ja"}}`);

    assert.equal(this.element.textContent.trim(), '2万');

    await render(hbs`{{short-number 11119234 "ja"}}`);

    assert.equal(this.element.textContent.trim(), '1112万');
  });

  // test('it renders "ne"', async function(assert) {
  //   await render(hbs`{{short-number 234 "ne"}}`);

  //   assert.equal(this.element.textContent.trim(), '234');

  //   await render(hbs`{{short-number 1234 "ne"}}`);

  //   assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '1 हजार');

  //   await render(hbs`{{short-number 19234 "ne"}}`);

  //   assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '19 k');

  //   await render(hbs`{{short-number 11119234 "ne"}}`);

  //   assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '11 M');

  //   await render(hbs`{{short-number "-19234" "ne"}}`);

  //   assert.equal(this.element.textContent.trim().replace(/\s+/, ' '), '-19 k');
  // });
});