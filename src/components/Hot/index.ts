import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';
export default class Hot extends Component {
  @tracked isVisible = true;
  constructor() {
    super(...arguments);
    window.addEventListener('hot-reload', (a) => {
      const detail = a.detail;
      const ref  = this.args.module;
      const target = '/' + detail.split('/src/')[1];
      if (ref === target) {
        this.isVisible = false;
        setTimeout(() => {
            this.isVisible = true;
        }, 10);
        console.log('hot reload', ref, target);
      }
    });
  }
  static template = precompileTemplate(`
        {{#if this.isVisible}}{{yield}}{{/if}}
  `);
}
