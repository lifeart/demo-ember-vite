import Router, { HashReturnType } from './config/router';
import MainTemplate from './templates/main';

export enum Routes {
  Main = 'main',
  About = 'about',
  NotFound = 'not-found',
  Bootstrap = 'bootstrap',
}

Router.lazyRoutes = {
  [Routes.Main]: () : HashReturnType => ({
      // sample of lazy-loaded route, and statically resolved template
      // have no idea how to fix typings here...
      route: import('./routes/main').then((m) => m.MainRoute),
      template: MainTemplate,
  }),
  [Routes.NotFound]: (): HashReturnType => ({
      // sample of lazy-loaded route, and dynamically resolved template
      template: import('./templates/not-found').then((m) => m.default),
  }),
  [Routes.Bootstrap]: (): HashReturnType => ({
    // sample of lazy-loaded route, and dynamically resolved template
    template: import('./templates/bootstrap').then((m) => m.default),
}),
}

Router.map(function () {
    this.route(Routes.Main, { path: '/' })
    this.route(Routes.About, { path: '/about' });
    this.route(Routes.Bootstrap, { path: '/bootstrap' });
    this.route(Routes.NotFound, { path: '*wildcard_path' });
});

export default Router;