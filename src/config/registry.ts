import Ember from './ember';
import type Service from '@ember/service';
import type Controller from '@ember/controller';
import type Route from '@ember/routing/route';
import type GlimmerComponent from '@glimmer/component';


/* imported routes */
import { ApplicationRoute } from '../routes/application';
// import { MainRoute } from '../routes/main';

/* imported controllers */
import { ApplicationController } from '../controllers/application';

/* imported templates */
import ApplicationTemplate from '../templates/application';
import AboutTemplate from '../templates/about';
import { PrecompiledTemplate } from '@ember/template-compilation';
/* imported services */
import DateService from '../services/date';

/* imported components */
import HelloWorld from '../components/HelloWorld';

type RegisteredComponent = typeof GlimmerComponent & { template: any };
type RegistryType = 'service' | 'controller' | 'route' | 'template' | 'component';
type RegistryKey = `${RegistryType}:${string}`;
interface IRegistry {
    [key: RegistryKey]: typeof Service | typeof Controller | typeof Route | RegisteredComponent | PrecompiledTemplate;
}

export function registerComponent<T>(component: T & { template: any }): RegisteredComponent {
    return Ember._setComponentTemplate(component.template, component);
}




function registry(): IRegistry {
    return {
        'service:date': DateService,
        'controller:application': ApplicationController,
        'route:application': ApplicationRoute,
        'template:application': ApplicationTemplate,
        'template:about': AboutTemplate,
        'component:hello-world': registerComponent(HelloWorld),
    };
}

export default registry;