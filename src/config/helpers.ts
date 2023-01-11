import GlimmerComponentManager from 'ember-component-manager';
import Component from '@glimmer/component';

export function setupApplicationGlobals(Ember) {
    GlimmerComponentManager.capabilities = Ember._componentManagerCapabilities('3.13');
    Ember._setComponentManager((owner) => {
        return new GlimmerComponentManager(owner);
    }, Component);
    window._Ember = Ember;
}