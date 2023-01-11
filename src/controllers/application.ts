import Controller from 'ember-source/dist/packages/@ember/controller';

export class ApplicationController extends Controller {
    init() {
      super.init(...arguments);
      console.log('init');
    }
}