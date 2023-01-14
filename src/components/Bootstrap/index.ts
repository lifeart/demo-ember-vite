import Component from '@glimmer/component';
import template from './template.hbs';

export default class Button extends Component {
    submit = () => console.log('submit');
    static template = template;
}