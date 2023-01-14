import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;
  @service router;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    await this.session.invalidate();

    this.router.transitionTo('main');
  }
}
