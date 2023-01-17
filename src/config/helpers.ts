import GlimmerComponentManager from 'ember-component-manager';
import Component from '@glimmer/component';
import { setOwner, getOwner } from '@ember/application';
import './inspector';

class CustomComponentManager extends GlimmerComponentManager {
  createComponent(factory, args) {
    const component = super.createComponent(factory, args);
    setOwner(component, getOwner(this));
    return component;
  }
}

export function setupApplicationGlobals(Ember) {
  GlimmerComponentManager.capabilities =
    Ember._componentManagerCapabilities('3.13');

  Ember._setComponentManager((owner) => {
    return new CustomComponentManager(owner);
  }, Component);

  window._Ember = Ember;
  window.Ember = Ember;
}
