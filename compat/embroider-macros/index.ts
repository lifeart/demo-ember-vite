import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';

export function getOwnConfig(...args) {
  console.log('getOwnConfig', ...args);
  return {};
}

export function dependencySatisfies(...args) {
  console.log('dependencySatisfies', ...args);
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
  console.log('importSync', name, ...args);
  return true;
}

export function isTesting(...args) {
  console.log('isTesting', ...args);
  return false;
}
