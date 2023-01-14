import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';
import * as recordData from '@ember-data/record-data/-private';
import * as model from '@ember-data/model/-private';

export function isDevelopingApp() {
    console.log('isDevelopingApp',...arguments);
    return true;
}

export function dependencySatisfies() {
    console.log('dependencySatisfies',...arguments);
    return true;
}

export function macroCondition(el) {
    console.log('macroCondition',...arguments);
    return el;
}

export function importSync(name) {
    if (name === '@ember/renderer') {
        return renderer;
    }
    if (name === '@glimmer/validator') {
        return validator;
    }
    if (name === '@ember-data/record-data/-private') {
        return recordData;
    }
    if (name === '@ember-data/model/-private') {
        return model;
    }
    console.log('importSync',...arguments);
    return true;
}

export function getOwnConfig() {
    console.log('getOwnConfig',...arguments);
    return {};
}

export function isTesting() {
    console.log('isTesting',...arguments);
    return false;
}