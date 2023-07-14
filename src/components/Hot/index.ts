import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

// eslint-disable-next-line no-var
var GlobalRefCache: Record<string, unknown> = {};
interface Args {
  component: unknown;
  module: string;
}
export default class Hot extends Component<Args> {
  @tracked isVisible = true;
  revision = 0;
  @tracked originalComponent: null | unknown = null;
  get component() {
    return this.originalComponent;
  }
  constructor() {
    super(...arguments);

    const { component, module } = this.args;
    this.originalComponent = GlobalRefCache[module] || component;

    const fn = (a: Event) => {
      const detail = (a as unknown as CustomEvent).detail;
      const ref = module;
      const target = '/' + detail.moduleName.split('/src/')[1];
      if (ref === target) {
        this.revision++;
        GlobalRefCache[module] = detail.component;
        this.originalComponent = detail.component;
      }
    };
    window.addEventListener('hot-reload', fn);
    registerDestructor(this, () => {
      window.removeEventListener('hot-reload', fn);
    });
  }
  static template = precompileTemplate(`
    {{yield this.component}}
  `);
}
