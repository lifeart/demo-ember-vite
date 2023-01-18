import ENV from './env';
import registry from './registry';
import type ApplicationClass from '@ember/application';
import type RouteClass from './router';
import { default as initializer } from '../initializer/logger';
import { default as instanceInitializer } from '../instance-initializers/logger';

export function init(
  Application: typeof ApplicationClass,
  Router: typeof RouteClass
) {
  // Init initializers
  Application.initializer(initializer);

  // Init instance initializers
  Application.instanceInitializer(instanceInitializer);

  const MyApp = Application.create({
    name: ENV.modulePrefix,
    version: ENV.APP.version,
  });

  const registryObjects = registry();
  console.table(registryObjects);

  Object.keys(registryObjects).forEach((key) => {
    const value = registryObjects[key];
    MyApp.register(key, value);
  });

  MyApp.register('config:environment', ENV);
  MyApp.register('router:main', Router);

  return MyApp;
}
