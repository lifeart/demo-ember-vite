import Ember from 'ember';
import { setupApplicationGlobals } from '@/config/helpers';
import registry from '@/config/registry';
import addonRegistry from '@/addons';
import config from '@/config/env';
import Application from '@/config/application';

export function create() {
  setupApplicationGlobals(Ember);

  const testConfig = JSON.parse(JSON.stringify(config.APP));

  testConfig.locationType = 'none';
  testConfig.rootElement = '#ember-testing';
  testConfig.LOG_ACTIVE_GENERATION = false;
  testConfig.LOG_VIEW_LOOKUPS = false;

  const app = Application.create(testConfig);

  const registryObjects = registry();

  Object.keys(registryObjects).forEach((key) => {
    const value = registryObjects[key];
    app.register(key, value);
  });

  Object.keys(addonRegistry).forEach((key) => {
    const value = addonRegistry[key];
    app.register(key, value);
  });

  app.register('config:environment', config);
  return app;
}
