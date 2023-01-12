import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DateService extends Service {
    interval: any;
    init() {
        super.init(...arguments);
        this.interval = setInterval(() => {
            this._date = new Date().toLocaleTimeString();
        }, 1000);
    }
    willDestroy() {
        super.willDestroy(...arguments);
        clearInterval(this.interval);
    }
    @tracked _date = new Date().toLocaleTimeString();
    get date() {
        return this._date;
    }
}