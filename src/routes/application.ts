import Route from '@ember/routing/route';


export class ApplicationRoute extends Route {
    model() {
      return ['red', 'yellow', 'blue'];
    }
}