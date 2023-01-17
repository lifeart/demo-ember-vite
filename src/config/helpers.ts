import GlimmerComponentManager from 'ember-component-manager';
import Component from '@glimmer/component';
import { setOwner, getOwner } from '@ember/application';
import './inspector';
import { capabilities } from '@ember/component';
import { setComponentManager } from '@ember/component';

class CustomComponentManager extends GlimmerComponentManager {
  createComponent(factory, args) {
    const component = super.createComponent(factory, args);
    setOwner(component, getOwner(this));
    return component;
  }
}

export function setupApplicationGlobals(Ember) {
  GlimmerComponentManager.capabilities = capabilities('3.13');

  setComponentManager((owner) => {
    return new CustomComponentManager(owner);
  }, Component);

  window._Ember = Ember;
  window.Ember = Ember;
}
