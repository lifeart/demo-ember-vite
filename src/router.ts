import EmberRouter from '@ember/routing/router';
import config from './config/env';

class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
    this.route('main', { path: '/' })
    this.route('about', { path: '/about' });
    this.route('not-found', { path: '*wildcard_path' });
});

export default Router;