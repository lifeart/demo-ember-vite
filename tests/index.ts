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
setupApplicationGlobals(Ember);


setApplication(Application.create(config.APP));

setup(QUnit.assert);

function add(a: number, b: number) {
  return a + b;
}

QUnit.module('add', hooks => {
    QUnit.test('two numbers', assert => {
        assert.equal(add(1, 2), 3);
    });
});

// start();