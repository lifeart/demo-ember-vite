import 'ember-qunit-styles/container.css';
import 'qunit/qunit/qunit.css';
import './../src/style.css';

import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import { create } from './helpers/application';

setApplication(create());

setup(QUnit.assert);

import.meta.glob('./unit/**/*-test.{gts,ts,js,gjs}', { eager: true });
import.meta.glob('./integration/**/*-test.{gts,ts,js,gjs}', {
  eager: true,
});

start({
  loadTests: false, // we could hook this to load our tests
});
