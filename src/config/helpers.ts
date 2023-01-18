import GlimmerComponentManager from 'ember-component-manager';
import Component from '@glimmer/component';
import { setOwner, getOwner } from '@ember/application';
import './inspector';
import { capabilities } from '@ember/component';
import { setComponentManager } from '@ember/component';
import { Ember } from '../../types/global';
import config from './env';

class CustomComponentManager extends GlimmerComponentManager {
  createComponent(factory, args) {
    const component = super.createComponent(factory, args);
    setOwner(component, getOwner(this)!);
    return component;
  }
}

export function setupApplicationGlobals(EmberNamespace: Ember) {
  GlimmerComponentManager.capabilities = capabilities('3.13');

  setComponentManager((owner) => {
    return new CustomComponentManager(owner);
  }, Component);

  window.EmberENV = config.EmberENV;
  window._Ember = EmberNamespace;
  window.Ember = EmberNamespace;
}
