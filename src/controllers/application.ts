import Controller from '@ember/controller';
import { service } from '@ember/service';

export class ApplicationController extends Controller {
  @service session;

  init() {
    super.init(...arguments);
    console.log('ApplicationController init');
  }
}
