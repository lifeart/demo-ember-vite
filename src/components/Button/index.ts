import Component from '@glimmer/component';
import template from './template.hbs';
import env from '@/config/env';
import { getComponentTemplate } from '@glimmer/manager';

export default class Button extends Component {
  static template = template;
}

if (import.meta.hot) {
  import.meta.hot.accept('./template.hbs', (newFoo) => {
    const app = Array.from(
      window[env.APP.globalName]._applicationInstances.values()
    )[0];
    const renderer = app.lookup('renderer:-dom');
    console.log(app, renderer);
    renderer._runtimeResolver.componentDefinitionCache.clear();
    renderer._context.constants.componentDefinitionCount = 0;
    renderer._context.constants.componentDefinitionCache = new WeakMap();

    renderer._runtime.program.constants.componentDefinitionCache =
      new WeakMap();

    Button.template = getComponentTemplate(newFoo.default);
    const tpl = Button.template(app).asLayout();
    const moduleName = tpl.moduleName;
    renderer._context.constants.values = renderer._context.constants.values.map(
      (e) => {
        if (e?.moduleName && e.moduleName === tpl.moduleName) {
          renderer._context.constants.indexMap.set(
            tpl,
            renderer._context.constants.indexMap.get(e)
          );
          renderer._context.constants.indexMap.delete(e);
          return tpl;
        } else {
          return e;
        }
      }
    );

    window.dispatchEvent(new CustomEvent('hot-reload', { detail: moduleName }));
  });
}
