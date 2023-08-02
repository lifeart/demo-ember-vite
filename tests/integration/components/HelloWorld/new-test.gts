import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import HelloWorld from '@/components/HelloWorld';

module('Integration | Component | HelloWorld | new', function (hooks) {
  setupRenderingTest(hooks);
  test('it renders', async function (assert) {
    const component = <template><HelloWorld /></template>
    await render(component);
    assert.dom('button').exists({ count: 5 });
  });
});
