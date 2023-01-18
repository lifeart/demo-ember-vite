import EmberApplication from '@ember/application';
import Resolver from 'ember-resolver/addon/resolvers/classic/index.js';
import ENV from './env';

export default class App extends EmberApplication {
  rootElement = ENV.rootElement;
  autoboot = ENV.autoboot;
  modulePrefix = ENV.modulePrefix;
  podModulePrefix = `${ENV.modulePrefix}/pods`;
  Resolver = Resolver;
}
