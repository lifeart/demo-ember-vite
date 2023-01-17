import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';
import * as manager from '@glimmer/manager';

export function getOwnConfig(...args) {
  console.log('getOwnConfig', ...args);
  return {};
}

export function dependencySatisfies(name: string, version: string) {
  if (name === 'ember-source' && version === '<3.24.0') {
    return false;
  }
  console.log('dependencySatisfies', name, version);
  return true;
}

export function macroCondition(el, ...args) {
  console.log('macroCondition', el, ...args);
  return el;
}

export function importSync(name, ...args) {
  if (name === '@ember/renderer') {
    return renderer;
  }
  if (name === '@glimmer/validator') {
    return validator;
  }
  if (name === '@glimmer/manager') {
    return manager;
  }
  console.log('importSync', name, ...args);
  return true;
}

export function isTesting(...args) {
  if (window.location.pathname.includes('/tests/')) {
    return true;
  }
  console.log('isTesting', ...args);
  return false;
}
