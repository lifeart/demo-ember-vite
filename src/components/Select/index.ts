import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';

export default class Select extends Component {
  onChange = (e: any) => {
    console.log(e);
  };
  options = [1, 2, 3];
  selectedOption = 1;
  static template = precompileTemplate(
    `
       <PowerSelect @options={{this.options}} @selected={{this.selectedOption}} @onChange={{this.onChange}} as |option|>
            {{option}}
        </PowerSelect>
    `
  );
}
