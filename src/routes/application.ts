import Route from 'ember-source/dist/packages/@ember/routing/route';


export class ApplicationRoute extends Route {
    model() {
      return ['red', 'yellow', 'blue'];
    }
}