import Controller from '@ember/controller';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/addon/services/session';
import type EmberNotify from 'ember-notify'
export class ApplicationController extends Controller {
  @service session: SessionService;
  @service notify: EmberNotify;

  constructor(...args: ConstructorParameters<typeof Controller>) {
    super(...args);
    this.notify.info('Welcome to Ember.js');
  }
}
