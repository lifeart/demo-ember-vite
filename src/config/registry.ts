import Ember from './ember';

/* imported routes */
import { ApplicationRoute } from '../routes/application';
import { MainRoute } from '../routes/main';

/* imported controllers */
import { ApplicationController } from '../controllers/application';

/* imported templates */
import ApplicationTemplate from '../templates/application';
import MainTemplate from '../templates/main';
import AboutTemplate from '../templates/about';
import NotFoundTemplate from '../templates/not-found';

/* imported services */
import DateService from '../services/date';

/* imported components */
import HelloWorld from '../components/HelloWorld';

export function registerComponent<T>(component: T & { template: any }): T {
    return Ember._setComponentTemplate(component.template, component);
}

function registry() {
    return {
        'service:date': DateService,
        'controller:application': ApplicationController,
        'route:application': ApplicationRoute,
        'route:main': MainRoute,
        'template:application': ApplicationTemplate,
        'template:main': MainTemplate,
        'template:about': AboutTemplate,
        'template:not-found': NotFoundTemplate,
        'component:hello-world': registerComponent(HelloWorld),
    };
}

export default registry;