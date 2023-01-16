import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | HelloWorld', function (hooks) {
  //   setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // await render(hbs`{{hello-world}}`);

    assert.dom('[data-test-support-logo]').exists({ count: 4 });
    assert.dom('[data-test-support-message]').exists();
  });
});
