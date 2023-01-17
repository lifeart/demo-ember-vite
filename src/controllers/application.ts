import Controller from '@ember/controller';
import { service } from '@ember/service';

export class ApplicationController extends Controller {
  @service session;

  constructor(...args) {
    super(...args);
    console.log('ApplicationController init');
  }
}
