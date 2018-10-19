import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// due to regex replacement
function replaceWhitespace(val) {
  return val.replace(/\s+/, ' ')
}

module('Integration | Helper | short-number', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders "en" <= 10,000', async function(assert) {
    await render(hbs`{{short-number 234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1K');

    await render(hbs`{{short-number 1234.23 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1K');

    await render(hbs`{{short-number 9499 "en"}}`);

    assert.equal(this.element.textContent.trim(), '9K', 'greater than 5% threshold so still use 1K rules');

    await render(hbs`{{short-number 9500 "en"}}`);

    assert.equal(this.element.textContent.trim(), '10K', 'within 5% threshold so use 10K rules');
  });

  test('it renders "en" <= 100,000', async function(assert) {
    await render(hbs`{{short-number 19234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '19K');

    await render(hbs`{{short-number 94999 "en"}}`);

    assert.equal(this.element.textContent.trim(), '95K', 'greater than 5% threshold so still use 10K rules');

    await render(hbs`{{short-number 95001 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'greater than 5% threshold so still use 10K rules');

    await render(hbs`{{short-number 99499 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'greater than 5% threshold so still use 10K rules');

    await render(hbs`{{short-number 99500 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'within than 5% threshold so still use 100K rules');

    await render(hbs`{{short-number 99999 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'it rounds 999999 up');

    await render(hbs`{{short-number 100000 "en"}}`);

    assert.equal(this.element.textContent.trim(), '100K');
  });

  test('it renders "en" <= 1,000,000', async function(assert) {
    await render(hbs`{{short-number 101000 "en"}}`, 'it does not round up to 1M');

    assert.equal(this.element.textContent.trim(), '101K');

    await render(hbs`{{short-number 101000 "en" significantDigits=1 financialFormat=true}}`);

    assert.equal(this.element.textContent.trim(), '0.1M', 'uses shorter format to display');

    await render(hbs`{{short-number 500000 "en"}}`);

    assert.equal(this.element.textContent.trim(), '500K', 'it does not round up to 1M');

    await render(hbs`{{short-number 600000 "en"}}`, 'it does not round up to 1M');

    assert.equal(this.element.textContent.trim(), '600K');

    await render(hbs`{{short-number 949999 "en"}}`);

    assert.equal(this.element.textContent.trim(), '950K', 'greater than 5% threshold');

    await render(hbs`{{short-number 995000 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold so use 1M rules');

    await render(hbs`{{short-number 999949 "en"}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold so use 1M rules');

    await render(hbs`{{short-number 11119234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '11M');

    await render(hbs`{{short-number "-19234" "en"}}`);

    assert.equal(this.element.textContent.trim(), '-19K', 'handles negative numbers such as -19234');

    await render(hbs`{{short-number "-19234.9" "en"}}`);

    assert.equal(this.element.textContent.trim(), '-19K');
  });

  test('it renders "en" with significantDigits', async function(assert) {
    await render(hbs`{{short-number 1234 "en" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '1.2K');

    await render(hbs`{{short-number 99499 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '99.5K', 'greater than 5% threshold');

    await render(hbs`{{short-number 99500 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '99.5K', 'within 5% threshold but still round');

    await render(hbs`{{short-number 99949 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '99.9K', 'within 5% threshold but still round');

    await render(hbs`{{short-number 99950 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '100K', 'within 5% threshold but should round');

    await render(hbs`{{short-number 101000 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '101K');

    await render(hbs`{{short-number 101000 "en" significantDigits=1 financialFormat=true}}`);

    assert.equal(this.element.textContent.trim(), '0.1M');

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

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold');

    await render(hbs`{{short-number 995100 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold so does not use significant digit');

    await render(hbs`{{short-number 999949 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold so does not use significant digit');

    await render(hbs`{{short-number 999950 "en" significantDigits=1}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold so does not use significant digit');

    await render(hbs`{{short-number 999950 "en" significantDigits=2}}`);

    assert.equal(this.element.textContent.trim(), '1M', 'within 5% threshold so does not use significant digit');

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

    await render(hbs`{{short-number 101000 "es"}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '101 mil');

    await render(hbs`{{short-number 101000 "es" significantDigits=1 financialFormat=true}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '0,1 M');

    await render(hbs`{{short-number 949949 "es" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '949,9 mil', 'greater than 5% threshold and does not round up');

    await render(hbs`{{short-number 949949 "es" significantDigits=2}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '949,95 mil', 'greater than 5% threshold and does not round up');

    await render(hbs`{{short-number 949999 "es" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '950 mil', 'greater than 5% threshold so still use 100K rules');

    await render(hbs`{{short-number 995000 "es" significantDigits=1}}`);

    assert.equal(replaceWhitespace(this.element.textContent.trim()), '1 M', 'within 5% threshold so no significant digits');

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

  module('Integration | Helper | short-number long format', function() {

    test('it renders "en" <= 10,000', async function(assert) {
      await render(hbs`{{short-number 234 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '234');

      await render(hbs`{{short-number 1234 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '1 thousand');

      await render(hbs`{{short-number 1234.23 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '1 thousand');

      await render(hbs`{{short-number 9499 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '9 thousand', 'greater than 5% threshold so still use 1 thousand rules');

      await render(hbs`{{short-number 9500 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '10 thousand', 'within 5% threshold so use 10 thousand rules');

      await render(hbs`{{short-number 99500 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '100 thousand', 'within 5% threshold so use 100 thousand rules');

      await render(hbs`{{short-number 999500 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '1 million', 'within 5% threshold so use 1 million rules');

      await render(hbs`{{short-number 9999500 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '10 million', 'within 5% threshold so use 10 million rules');

      await render(hbs`{{short-number 99999500 "en" long=true}}`);

      assert.equal(this.element.textContent.trim(), '100 million', 'within 5% threshold so use 100 million rules');
    });

    test('it renders "ja"', async function(assert) {
      await render(hbs`{{short-number 234 "ja" long=true}}`);

      assert.equal(this.element.textContent.trim(), '234');

      await render(hbs`{{short-number 1234 "ja" long=true}}`);

      assert.equal(this.element.textContent.trim(), '1');

      await render(hbs`{{short-number 11634 "ja" significantDigits=1}}`);

      assert.equal(this.element.textContent.trim(), '1.2万');

      await render(hbs`{{short-number 19234 "ja" long=true}}`);

      assert.equal(this.element.textContent.trim(), '2万');

      await render(hbs`{{short-number 11119234 "ja" long=true}}`);

      assert.equal(this.element.textContent.trim(), '1112万');
    });
  });
});
