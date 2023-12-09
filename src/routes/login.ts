import Route from '@ember/routing/route';
import { service } from '@ember/service';
// import SessionService from 'ember-simple-auth/addon/services/session';

export default class LoginRoute extends Route {
  // @service session: SessionService;

  beforeModel() {
    // this.session.prohibitAuthentication('main');
  }
}
