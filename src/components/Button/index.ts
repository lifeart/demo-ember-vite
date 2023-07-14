import Component from '@glimmer/component';
import template from './template.hbs';
import { getComponentTemplate } from '@glimmer/manager';

export default class Button extends Component {
  static template = template;
  a = '';
}

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    const tpl = getComponentTemplate(newModule.default);
    const moduleName = tpl().moduleName;
    window.dispatchEvent(
      new CustomEvent('hot-reload', {
        detail: {
          moduleName,
          component: newModule.default,
        },
      })
    );
  });
  import.meta.hot.accept('./template.hbs', (newFoo) => {
    const tpl = getComponentTemplate(newFoo.default);
    const moduleName = tpl().moduleName;
    class NewComponent extends Button {
      static template = tpl;
    }
    window.dispatchEvent(
      new CustomEvent('hot-reload', {
        detail: {
          moduleName,
          component: NewComponent,
        },
      })
    );
  });
}
