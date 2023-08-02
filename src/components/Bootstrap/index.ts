import Component from '@glimmer/component';
import template from './index.hbs';

export default class Bootstrap extends Component {
  submit = () => console.log('submit');
  static template = template;
}
