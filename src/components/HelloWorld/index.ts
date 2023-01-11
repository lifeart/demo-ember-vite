import Component from '@glimmer/component/addon/-private/component';
import { tracked }  from './../../config/ember';
export default class HelloWorld extends Component {
    @tracked _date = new Date().toString();
    constructor() {
        super(...arguments);
        setInterval(() => {
            this._date = new Date().toString();
        }, 1000);
    }
    get date() {
        return this._date;
    }
    static template = `
        <h1>Hello World (from component) {{this.date}}</h1>
    `
}