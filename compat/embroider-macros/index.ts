import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';
import * as manager from '@glimmer/manager';
import * as recordData from '@ember-data/json-api';
import * as model from '@ember-data/model/-private';

export function isDevelopingApp() {
  // eslint-disable-next-line prefer-rest-params
  console.log('isDevelopingApp', ...arguments);
  return true;
}

export function getOwnConfig(...args: unknown[]) {
  console.info('getOwnConfig', ...args);
  return {
    env: {
      DEBUG: true,
    },
  };
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
  console.info('dependencySatisfies', name, version, new Error().stack);
  return true;
}

export function macroCondition(value: boolean) {
  // console.log('macroCondition', el, ...args);
  return value;
}

export function importSync(name: string) {
  if (name === '@ember/renderer') {
    return renderer;
  }
  if (name === '@glimmer/validator') {
    return validator;
  }
  if (name === '@glimmer/manager') {
    return manager;
  }
  if (name === '@ember-data/json-api') {
    return recordData;
  }
  if (name === '@ember-data/model/-private') {
    return model;
  }

  console.info('importSync', name, new Error().stack);
  return true;
}

export function isTesting() {
  if (window.location.pathname.includes('/tests/')) {
    return true;
  }
  return false;
}
