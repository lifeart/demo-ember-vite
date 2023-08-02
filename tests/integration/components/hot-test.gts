import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import Hot from '@/components/Hot';
import TrueButton from '@/components/Button';
import Footer from '@/components/Footer';

module('Integration | Component | Hot', function (hooks) {
  setupRenderingTest(hooks);
  test('it renders for registry items', async function (assert) {
    const component = <template>
        <Hot @component='button' as |Button|>
            <Button>Button1</Button>
            <Button>Button2</Button>
            <Button>Button3</Button>
            <Button>Button4</Button>
        </Hot>
    </template>
    await render(component);
    assert.dom('button').exists({ count: 4 });
  });
  test('it renders for import items', async function (assert) {
    const component = <template>
        <Hot @component={{TrueButton}} as |Button|>
            <Button>Button1</Button>
            <Button>Button2</Button>
            <Button>Button3</Button>
            <Button>Button4</Button>
        </Hot>
    </template>
    await render(component);
    assert.dom('button').exists({ count: 4 });
  });

  test('hot reload works', async function (assert) {
    const component = <template>
        <Hot @component={{TrueButton}} as |Button|>
            <Button>Button1</Button>
            <Button>Button2</Button>
            <Button>Button3</Button>
            <Button>Button4</Button>
        </Hot>
    </template>
    await render(component);
    assert.dom('button').exists({ count: 4 });

    const moduleName = '/src/components/Button/index.hbs';
    window.dispatchEvent(
        new CustomEvent('hot-reload', {
            detail: {
            moduleName,
            component: Footer,
        },
        })
    );
    
    await settled();
    assert.dom('button').doesNotExist();
    assert.dom('footer').exists();

    window.dispatchEvent(
        new CustomEvent('hot-reload', {
            detail: {
            moduleName,
            component: TrueButton,
            },
        })
    );

    await settled();

    assert.dom('button').exists({ count: 4 });
    assert.dom('footer').doesNotExist();
  });
});
