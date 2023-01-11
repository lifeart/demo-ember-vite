import GlimmerComponentManager from '@glimmer/component/addon/-private/ember-component-manager.js';
import Component from '@glimmer/component/addon/-private/component';

export function setupApplicationGlobals(Ember) {
    GlimmerComponentManager.capabilities = Ember._componentManagerCapabilities('3.13');
    Ember._setComponentManager((owner) => {
        return new GlimmerComponentManager(owner);
    }, Component);
    window._Ember = Ember;
}