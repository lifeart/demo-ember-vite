import Component from '@glimmer/component';
import template from './index.hbs';

export interface ButtonSignature {
  Element: HTMLButtonElement;
  Blocks: {
    default: [];
  };
}

export default class Button extends Component<ButtonSignature> {
  static template = template;
  a = '';
}
