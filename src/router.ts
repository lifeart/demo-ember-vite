import EmberRouter from '@ember/routing/router';
import config from './config/env';
import Ember from 'ember';
import { lazyRoutes } from './config/registry';

/*
  Here we use part of lazy-loading logic from https://github.com/embroider-build/embroider/blob/main/packages/router/src/index.ts
*/

class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
  loadedRoutes = new Set();

  // This is the framework method that we're overriding to provide our own
  // handlerResolver.
  setupRouter(...args: unknown[]) {
    // @ts-expect-error extending private method
    let isSetup = super.setupRouter(...args);
    let microLib = (this as unknown as { _routerMicrolib: { getRoute: (name: string) => unknown } })._routerMicrolib;
    microLib.getRoute = this._handlerResolver(microLib.getRoute.bind(microLib));
    return isSetup;
  }

  lazyBundle(name: string) {
    if (this.loadedRoutes.has(name)) {
      return null;
    }
    const routeResolver = lazyRoutes[name];
    const owner = Ember.getOwner(this);
    if (routeResolver) {
      return {
        load: async () => {
          const hash = routeResolver();
          const keys = Object.keys(hash);
          const values = await Promise.all(keys.map((key) => hash[key]));
          keys.forEach((key, index) => {
            // owner.unregister(`${key}:${name}`);
            owner.register(`${key}:${name}`, values[index]);
          });
          this.loadedRoutes.add(name);
        },
        loaded: false,
      };
    }
    return null;
  }

  private _handlerResolver(original: (name: string) => unknown) {
    return (name: string) => {
      const bundle = this.lazyBundle(name);

      if (!bundle || bundle.loaded) {
        return original(name);
      }

      return bundle.load().then(
        () => {
          bundle.loaded = true;
          return original(name);
        },
        (err: Error) => {
          throw err;
        }
      );
    };
  }
}

Router.map(function () {
    this.route('main', { path: '/' })
    this.route('about', { path: '/about' });
    this.route('not-found', { path: '*wildcard_path' });
});

export default Router;