import Controller from '@ember/controller';
import { service } from '@ember/service';
import type SessionService from 'ember-simple-auth/addon/services/session';
import type EmberNotify from 'ember-notify';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';
import type { Task } from 'ember-concurrency';

type MyTaskType = Task<void, []>;

export class ApplicationController extends Controller {
  @service session: SessionService;
  @service notify: EmberNotify;
  @tracked showModal = true;

  closeModalTask: MyTaskType = restartableTask(async () => {
    await this.notify.info(
      `You trying to close modal, let's debounce it for 300ms`
    );
    await timeout(300);
    this.showModal = false;
  });

  closeModal = () => {
    this.closeModalTask.perform();
  };

  constructor(...args: ConstructorParameters<typeof Controller>) {
    super(...args);
    this.notify.info('Welcome to Ember.js');
  }
}
