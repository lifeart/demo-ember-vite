import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { getComponentTemplate } from '@glimmer/manager';

// Take from https://github.com/emberjs/ember.js/blob/b31998b6a0cccd22a8fb6fab21d24e5e7f2cb70d/packages/ember-template-compiler/lib/system/dasherize-component-name.ts
// we need this because Ember.String.dasherize('XTestWrapper') -> xtest-wrapper, not x-test-wrapper
const SIMPLE_DASHERIZE_REGEXP = /[A-Z]|::/g;
const ALPHA = /[A-Za-z0-9]/;
export function dasherizeName(name = '') {
  return name.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
    if (char === '::') {
      return '/';
    }

    if (index === 0 || !ALPHA.test(name[index - 1])) {
      return char.toLowerCase();
    }

    return `-${char.toLowerCase()}`;
  });
}

// eslint-disable-next-line no-var
var GlobalRefCache: Record<string, unknown> = {};
interface Args {
  component: unknown;
}
export default class Hot extends Component<Args> {
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
        `component:${dasherizeName(component)}`
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
