import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import SessionService from 'ember-simple-auth/addon/services/session';

export default class ProfileRoute extends Route {
  @service session: SessionService;

  beforeModel(transition: Transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return this.session.data.authenticated;
  }
}
