import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
// import SessionService from 'ember-simple-auth/addon/services/session';
// import StoreService from '@/services/store';

export default class ProfileRoute extends Route {
  // @service session: SessionService;
  // @service store: StoreService;

  beforeModel(transition: Transition) {
    // this.session.requireAuthentication(transition, 'login');
  }

  model() {
    // const model = this.session.data.authenticated;
    // const user = this.store.peekRecord('person', model.id);
    // return user ?? this.store.createRecord('person', model);
  }
}
