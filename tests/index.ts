// import './../src/style.css';
import 'ember-qunit-styles/container.css';
import 'qunit/qunit/qunit.css';

import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { create } from './helpers/application';

setApplication(create());

setup(QUnit.assert);

import.meta.glob('./unit/utils/*.ts', { eager: true });
import.meta.glob('./integration/components/**/*.ts', { eager: true });

start({
  loadTests: false, // we could hook this to load our tests
  setupTestAdapter: false, // we could remove it once deal with Ember.Test.Adapter
});
