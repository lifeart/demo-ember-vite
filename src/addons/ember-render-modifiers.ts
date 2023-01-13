import DidInsert from '@ember/render-modifiers/addon/modifiers/did-insert';
import DidUpdate from '@ember/render-modifiers/addon/modifiers/did-update';
import WillDestroy from '@ember/render-modifiers/addon/modifiers/will-destroy';

const registry = {
    'modifier:did-insert': DidInsert,
    'modifier:did-update': DidUpdate,
    'modifier:will-destroy': WillDestroy,
}

export default registry;