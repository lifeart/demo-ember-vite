import DidInsert from '@ember/render-modifiers/addon/modifiers/did-insert';
import DidUpdate from '@ember/render-modifiers/addon/modifiers/did-update';
import WillDestroy from '@ember/render-modifiers/addon/modifiers/will-destroy';

import type DidInsertModifier from 'ember-render-modifiers/modifiers/did-insert';
import type DidUpdateModifier from 'ember-render-modifiers/modifiers/did-update';
import type WillDestroyModifier from 'ember-render-modifiers/modifiers/will-destroy';

const registry = {
  'modifier:did-insert': DidInsert,
  'modifier:did-update': DidUpdate,
  'modifier:will-destroy': WillDestroy,
};

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'did-insert': typeof DidInsertModifier;
    'did-update': typeof DidUpdateModifier;
    'will-destroy': typeof WillDestroyModifier;
  }
}

export default registry;
