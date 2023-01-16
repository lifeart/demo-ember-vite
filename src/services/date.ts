import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DateService extends Service {
  interval: ReturnType<(typeof window)['setInterval']> | null = null;
  @tracked _date = new Date();

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    super.init(...arguments);

    this.interval = setInterval(() => {
      this._date = new Date();
    }, 1000);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  get date() {
    return this._date.toLocaleTimeString();
  }
}
