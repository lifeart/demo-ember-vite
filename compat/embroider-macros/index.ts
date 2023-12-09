// import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';
import * as manager from '@glimmer/manager';
import { DEBUG } from '@glimmer/env';
// import * as recordData from '@ember-data/json-api';
// import * as model from '@ember-data/model/-private';
// import * as graph from '@ember-data/graph/-private';
// import { getDataConfig } from './../ember-data-private-build-infra';
import * as owner from '@ember/owner';

export function isDevelopingApp() {
  // eslint-disable-next-line prefer-rest-params
  console.log('isDevelopingApp', ...arguments);
  return true;
}

export function getOwnConfig(...args: unknown[]) {
  // console.info('getOwnConfig', ...args);
  // edata config
  return getDataConfig(DEBUG);
}

export function dependencySatisfies(name: string, version: string) {
  if (name === 'ember-source' && version === '<3.24.0') {
    return false;
  }
  if (name === 'ember-source' && version === '> 3.27.0-beta.1') {
    return true;
  }
  if (name === 'ember-source' && version === '>= 3.22.0-beta.1') {
    return true;
  }
  if (name === 'ember-source' && version === '>= 3.22.0-alpha.1') {
    return true;
  }

  if (name === 'ember-source' && version === '^3.22.0 || ^4.0.0') {
    return true;
  }

  if (name === 'ember-source' && version === '>=3.25.0-beta.1') {
    return true;
  }

  if (name === 'ember-source' && version === '>=3.27.0-alpha.1') {
    return true;
  }
  if (name === 'ember-source' && version === '>=4.5.0-beta.1') {
    return true;
  }
  if (name === 'ember-source' && version === '>=4.12.0') {
    return true;
  }
  console.info('dependencySatisfies', name, version, new Error().stack);
  return true;
}

export function macroCondition(value: boolean) {
  // console.log('macroCondition', el, ...args);
  return value;
}

export function importSync(name: string) {
  if (name === '@ember/renderer') {
    return {};
  }
  if (name === '@glimmer/validator') {
    return validator;
  }
  if (name === '@glimmer/manager') {
    return manager;
  }
  if (name === '@ember-data/json-api') {
    // return recordData;
  }
  if (name === '@ember-data/model/-private') {
    // return model;
  }
  if (name === '@ember-data/graph/-private') {
    // return graph;
  }
  if (name === '@ember/owner') {
    return owner;
  }

  console.info('importSync1', name, new Error().stack);
  return true;
}

export function isTesting() {
  if (window.location.pathname.includes('/tests/')) {
    return true;
  }
  return false;
}
