import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export class LoginController extends Controller {
  @service session;
  @service router;

  @action
  async authenticate(e) {
    e.preventDefault();

    await this.session.authenticate('authenticator:custom');

    if (this.session.isAuthenticated) {
      this.router.transitionTo('main');
    }
  }
}
