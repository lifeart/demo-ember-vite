import { ApplicationController } from '../controllers/application';
import { ApplicationRoute } from '../routes/application';
import ApplicationTemplate from '../templates/application';
import Ember from './ember';
import HelloWorld from '../components/HelloWorld';

function registerComponent(component) {
    return Ember._setComponentTemplate(window.compile(component.template), component);
}

function registry() {
    return {
        'controller:application': ApplicationController,
        'route:application': ApplicationRoute,
        'template:application': ApplicationTemplate(),
        'component:hello-world': registerComponent(HelloWorld),
    };
}

export default registry;