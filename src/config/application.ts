import EmberApplication from 'ember-source/dist/packages/@ember/application';
import Resolver from 'ember-resolver/addon/index.js';
import ENV from './env';

export default class App extends EmberApplication {
    rootElement = '#app';
    autoboot = false;
    modulePrefix = ENV.modulePrefix;
    podModulePrefix = `${ENV.modulePrefix}/pods`;
    Resolver = Resolver;
}