import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('scott Integration | Helper | short-number', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // await render(hbs`{{short-number 234 "en"}}`);

    // assert.equal(this.element.textContent.trim(), '234');

    // await render(hbs`{{short-number 1234 "en"}}`);

    // assert.equal(this.element.textContent.trim(), '1K');

    // await render(hbs`{{short-number 19234 "en"}}`);

    // assert.equal(this.element.textContent.trim(), '19K');

    await render(hbs`{{short-number 11119234 "en"}}`);

    assert.equal(this.element.textContent.trim(), '11M');

    // await render(hbs`{{short-number "-19234" "en"}}`);

    // assert.equal(this.element.textContent.trim(), '-19K');
  });

  test('it renders Spanish', async function(assert) {
    await render(hbs`{{short-number 234 "es"}}`);

    assert.equal(this.element.textContent.trim(), '234');

    await render(hbs`{{short-number 1234 "es"}}`);

    assert.equal(this.element.textContent.trim(), '1 mil');

    await render(hbs`{{short-number 19234 "es"}}`);

    assert.equal(this.element.textContent.trim(), '19 mil');

    await render(hbs`{{short-number 11119234 "es"}}`);

    assert.equal(this.element.textContent.trim(), '11 M');

    await render(hbs`{{short-number "-19234" "es"}}`);

    assert.equal(this.element.textContent.trim(), '-19 mil');
  });
});
