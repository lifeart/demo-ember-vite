import Ember from './ember';

/* imported routes */
import { ApplicationRoute } from '../routes/application';
// import { MainRoute } from '../routes/main';

/* imported controllers */
import { ApplicationController } from '../controllers/application';

/* imported templates */
import ApplicationTemplate from '../templates/application';
import MainTemplate from '../templates/main';
import AboutTemplate from '../templates/about';

/* imported services */
import DateService from '../services/date';

/* imported components */
import HelloWorld from '../components/HelloWorld';

export function registerComponent<T>(component: T & { template: any }): T {
    return Ember._setComponentTemplate(component.template, component);
}

export const lazyRoutes = {
    main: () => ({
        route: import('../routes/main').then((m) => m.MainRoute),
        template: MainTemplate,
    }),
    'not-found': () => ({
        template: import('../templates/not-found').then((m) => m.default),
    }),
}

function registry() {
    return {
        'service:date': DateService,
        'controller:application': ApplicationController,
        'route:application': ApplicationRoute,
        'template:application': ApplicationTemplate,
        'template:main': MainTemplate,
        'template:about': AboutTemplate,
        'component:hello-world': registerComponent(HelloWorld),
    };
}

export default registry;