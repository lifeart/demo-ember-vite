import Component from '@glimmer/component';
import template from './template.hbs';
import { getComponentTemplate } from '@glimmer/manager';

export default class Button extends Component {
  static template = template;
  a = '';
}

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    const tpl = getComponentTemplate(Button.template);
    const moduleName = tpl(undefined).moduleName;
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
    const moduleName = tpl(undefined).moduleName;
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
