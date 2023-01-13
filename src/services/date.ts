import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DateService extends Service {
  interval: any;
  @tracked _date = new Date();

  init() {
    super.init(...arguments);

    this.interval = setInterval(() => {
      this._date = new Date();
    }, 1000);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    clearInterval(this.interval);
  }

  get date() {
    return this._date.toLocaleTimeString();
  }
}
