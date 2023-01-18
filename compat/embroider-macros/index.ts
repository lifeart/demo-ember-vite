import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';
import * as manager from '@glimmer/manager';

export function getOwnConfig(...args: unknown[]) {
  console.info('getOwnConfig', ...args);
  return {};
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
  console.info('importSync', name, new Error().stack);
  return true;
}

export function isTesting() {
  if (window.location.pathname.includes('/tests/')) {
    return true;
  }
  return false;
}
