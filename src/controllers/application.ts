import Controller from '@ember/controller';
import { service } from '@ember/service';
import SessionService from 'ember-simple-auth/addon/services/session';

export class ApplicationController extends Controller {
  @service session: SessionService;

  constructor(...args: ConstructorParameters<typeof Controller>) {
    super(...args);
    console.log('ApplicationController init');
  }
}
