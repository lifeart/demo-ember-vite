import Route from '@ember/routing/route';
import { service } from '@ember/service';

export class ApplicationRoute extends Route {
  @service intl;

  async beforeModel() {
    const response = await fetch('/translations/en-us.json');
    const translations = await response.json();

    this.intl.addTranslations('en-US', translations);
    this.intl.setLocale(['en-us']);
  }

  model() {
    return ['red', 'yellow', 'blue'];
  }
}
