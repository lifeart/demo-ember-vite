import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
// import SessionService from 'ember-simple-auth/addon/services/session';
import RouterService from '@ember/routing/router-service';

export class LoginController extends Controller {
  // @service session: SessionService;
  @service router!: RouterService;

  @action
  async authenticate(e: MouseEvent) {
    e.preventDefault();

    await this.session.authenticate('authenticator:custom');
  }
}
