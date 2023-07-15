import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { getComponentTemplate } from '@glimmer/manager';
// Take from https://github.com/emberjs/ember.js/blob/b31998b6a0cccd22a8fb6fab21d24e5e7f2cb70d/packages/ember-template-compiler/lib/system/dasherize-component-name.ts
// we need this because Ember.String.dasherize('XTestWrapper') -> xtest-wrapper, not x-test-wrapper
const SIMPLE_DASHERIZE_REGEXP = /[A-Z]|::/g;
const ALPHA = /[A-Za-z0-9]/;
function dasherizeName(name = '') {
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

function shouldSkipFile(moduleName: string) {
  return moduleName.includes('/node_modules/');
}

function moduleNameFromFile(file: string) {
  return '/' + file.split('/src/')[1];
}
const HotReloadEvent = 'hot-reload';

// eslint-disable-next-line no-var
var GlobalRefCache: Record<string, unknown> = {};
interface Args {
  component: unknown;
}
const seenEvents = new WeakSet();
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
    const tpl = getComponentTemplate(component as object);
    if (!tpl) {
      this.originalComponent = component;
      console.info(
        'Component has no template. Skipping hot reload for',
        component
      );
      return;
      // here, likely we could resolve template from registry by component name (if really needed)
    }
    const moduleName = tpl().moduleName;
    if (shouldSkipFile(moduleName)) {
      this.originalComponent = component;
      console.info('Skipping hot reload for', moduleName);
      return;
    }
    const module = moduleNameFromFile(moduleName);
    // console.log('moduleName', moduleName);
    this.originalComponent = GlobalRefCache[module] || component;

    const fn = (a: Event) => {
      if (!seenEvents.has(a)) {
        seenEvents.add(a);
        // singletone case, likely need to be an service
        if (a.detail.moduleName.includes('/src/templates/')) {
          console.log('template is updated', owner);
          const routeName = a.detail.moduleName
            .split('/templates/')[1]
            .split('.')[0];
          const key = `template:${routeName.split('.').join('/')}`;
          const routeKey = `route:${routeName.split('.').join('/')}`;
          const hasRouteClass = routeKey in owner.base.__registry__.registrations;
          const routeInstance = owner.lookup(routeKey);
          owner.unregister(key);
          owner.register(key, a.detail.component);

          // found ember did not re-render template if model return stable thing
          if (routeInstance.model.toString().includes('[STATE_SYMBOL]')) {
            if (!hasRouteClass) {
              // patching default router
              routeInstance.model = () => ({}); // new ref needed for refresh
              owner.lookup(routeKey).refresh();
            } else {
              owner.lookup(`route:application`).refresh();
            }
          } else {
            owner.lookup(routeKey).refresh();
          }
          return;
        }
      }
      const detail = (a as unknown as CustomEvent).detail;
      const ref = module;
      const target = moduleNameFromFile(detail.moduleName);
      if (ref === target) {
        this.revision++;
        GlobalRefCache[module] = detail.component;
        this.originalComponent = detail.component;
      }
    };
    window.addEventListener(HotReloadEvent, fn);
    registerDestructor(this, () => {
      window.removeEventListener(HotReloadEvent, fn);
    });
  }
  static template = precompileTemplate(`
    {{yield this.component}}
  `);
}
