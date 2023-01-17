// import './../src/style.css';
import 'ember-qunit-styles/container.css';
import 'qunit/qunit/qunit.css';

import Ember from 'ember';
import Application from '@/config/application';
import { setupApplicationGlobals } from '@/config/helpers';
import registry from '@/config/registry';
import config from '@/config/env';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';


// import * as testing from 'ember-testing';

// console.log('testing', testing);
// import { start } from 'ember-qunit';

// delete Ember.Test;
// testing.Test.Adapter = testing.Adapter;
// Ember.Test = testing.Test;

// console.log('Ember.Test.Adapter', Ember.Test.Adapter);


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

app.register('config:environment', config);

setApplication(app);

QUnit.config.autostart = true;

setup(QUnit.assert);

import.meta.glob('./unit/utils/*.ts', { eager: true });
import.meta.glob('./integration/components/**/*.ts', { eager: true });

// start();
