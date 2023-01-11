import Controller from '@ember/controller';

export class ApplicationController extends Controller {
    init() {
      super.init(...arguments);
      console.log('init');
    }
}