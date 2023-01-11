import Component from '@glimmer/component/addon/-private/component';

import Ember from './../../config/ember';

export default class HelloWorld extends Component {
    _date = new Date().toString();
    constructor() {
        console.log([...arguments]);
        super(...arguments);
        setInterval(() => {
            console.log('set new date');
            Ember.set(this, '_date', new Date().toString());
        }, 1000);
    }
    get date() {
        return Ember.get(this, '_date');
    }
    static template = `
        <h1>Hello World (from component) {{this.date}}</h1>
    `
}