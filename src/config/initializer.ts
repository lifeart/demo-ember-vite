import ENV from './env';
import registry from './registry';
import type ApplicationClass from '@ember/application';
import type RouteClass from './router';
import { default as initializer } from '../initializers/logger';
import { default as logger } from '../instance-initializers/logger';
import { default as modalDialog } from '../instance-initializers/ember-modal-dialog';
import { default as emberDataInitializer } from '../initializers/ember-data';

export function init(
  Application: typeof ApplicationClass,
  Router: typeof RouteClass
) {
  // Init initializers
  Application.initializer(initializer);
  Application.initializer(emberDataInitializer);

  // Init instance initializers
  Application.instanceInitializer(logger);
  Application.instanceInitializer(modalDialog);

  const app = Application.create({
    name: ENV.modulePrefix,
    version: ENV.APP.version,
  });

  const registryObjects = registry();
  console.table(registryObjects);

  Object.keys(registryObjects).forEach((key) => {
    const value = registryObjects[key];
    app.register(key, value);
  });

  app.register('config:environment', ENV);
  app.register('router:main', Router);

  return app;
}
