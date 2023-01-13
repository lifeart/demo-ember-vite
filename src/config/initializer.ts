import ENV from './env';
import registry from './registry';
import type Application from '@ember/application';
import { default as initializer } from '../initializer/logger';
import { default as instanceInitializer } from '../instance-initializers/logger';

export function init(application: Application, router: any) {
  // Init initializers
  application.initializer(initializer);

  // Init instance initializers
  application.instanceInitializer(instanceInitializer);

  const MyApp = application.create({
    name: ENV.modulePrefix,
    version: '0.0.0+33d058ab',
  });

  const registryObjects = registry();
  console.table(registryObjects);

  Object.keys(registryObjects).forEach((key) => {
    const value = registryObjects[key];
    MyApp.register(key, value);
  });

  MyApp.register('config:environment', ENV);
  MyApp.register('router:main', router);

  return MyApp;
}
