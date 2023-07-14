import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';
export default class Hot extends Component {
  @tracked isVisible = true;
  revision = 0;
  @tracked originalComponent = this.args.component;
  get component() {
    return this.originalComponent;
  }
  constructor() {
    super(...arguments);
    window.addEventListener('hot-reload', (a) => {
      const detail = a.detail;
      const ref  = this.args.module;
      const target = '/' + detail.moduleName.split('/src/')[1];
      if (ref === target) {
        this.revision++;
        this.originalComponent = detail.component;
      }
    });
  }
  static template = precompileTemplate(`
    {{yield this.component}}
  `);
}
