import Controller from '@ember/controller';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/addon/services/session';
import type EmberNotify from 'ember-notify';
import { tracked } from '@glimmer/tracking';
export class ApplicationController extends Controller {
  @service session: SessionService;
  @service notify: EmberNotify;
  @tracked showModal = true;

  closeModal = () => {
    this.showModal = false;
  };

  constructor(...args: ConstructorParameters<typeof Controller>) {
    super(...args);
    this.notify.info('Welcome to Ember.js');
  }
}
