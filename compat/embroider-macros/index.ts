import * as renderer from '@ember/renderer';
import * as validator from '@glimmer/validator';

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
    console.log('importSync',...arguments);
    return true;
}


export function isTesting() {
    console.log('isTesting',...arguments);
    return false;
}