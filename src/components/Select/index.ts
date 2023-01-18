import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';

export default class Select extends Component {
  onChange = (el: number) => {
    this.selectedOption = el;
  };
  options = [1, 2, 3];
  @tracked
  selectedOption = 1;
  static template = precompileTemplate(
    `
       <PowerSelect @options={{this.options}} @selected={{this.selectedOption}} @onChange={{this.onChange}} as |option|>
            {{option}}
        </PowerSelect>
    `
  );
}
