import * as renderer from '@ember/renderer';

export function dependencySatisfies() {
    console.log('dependencySatisfies',...arguments);
    return true;
}

export function macroCondition() {
    console.log('macroCondition',...arguments);
    return true;
}

export function importSync(name) {
    if (name === '@ember/renderer') {
        return renderer;
    }
    console.log('importSync',...arguments);
    return true;
}
