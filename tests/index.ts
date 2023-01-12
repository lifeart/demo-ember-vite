// import './../src/style.css';
import 'ember-qunit-styles/container.css';
import 'qunit/qunit/qunit.css';

import Ember from 'ember';
import * as testing from 'ember-testing';
import Application from '@/config/application';
import { setupApplicationGlobals } from '@/config/helpers';

import config from '@/config/env';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
// import { start } from 'ember-qunit';

// delete Ember.Test;
// testing.Test.Adapter = testing.Adapter;
// Ember.Test = testing.Test;

// console.log('Ember.Test.Adapter', Ember.Test.Adapter);
// console.log('testing', testing);

// import './unit/utils/add';

setupApplicationGlobals(Ember);


setApplication(Application.create(config.APP));

setup(QUnit.assert);

import.meta.glob('./unit/utils/*.ts', { eager: true })


// start();