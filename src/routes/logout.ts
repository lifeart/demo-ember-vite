import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import Transition from '@ember/routing/transition';
import { service } from '@ember/service';
// import SessionService from 'ember-simple-auth/addon/services/session';

export default class LogoutRoute extends Route {
  // @service session: SessionService;
  @service router!: RouterService;

  async beforeModel(transition: Transition) {
    // this.session.requireAuthentication(transition, 'login');

    // await this.session.invalidate();

    // this.router.transitionTo('main');
  }
}
