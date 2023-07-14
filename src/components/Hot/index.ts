import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { getComponentTemplate } from '@glimmer/manager';

// eslint-disable-next-line no-var
var GlobalRefCache: Record<string, unknown> = {};
interface Args {
  component: unknown;
}
export default class Hot extends Component<Args> {
  @tracked isVisible = true;
  revision = 0;
  @tracked originalComponent: null | unknown = null;
  get component() {
    return this.originalComponent;
  }
  constructor(owner: any, args: Args) {
    super(owner, args);
    // eslint-disable-next-line prefer-const
    let { component } = this.args;
    if (typeof component === 'string') {
      const maybeComponent = owner.application.__registry__.resolve(
        `component:${component.toLowerCase()}`
      );
      if (maybeComponent) {
        component = maybeComponent;
      } else {
        throw new Error(`Component ${component} not found`);
      }
    }
    const tpl = getComponentTemplate(component);
    const moduleName = tpl().moduleName;
    const module = '/' + moduleName.split('/src/')[1];
    // console.log('moduleName', moduleName);
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
