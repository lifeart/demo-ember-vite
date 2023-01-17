import Route from '@ember/routing/route';
import { service } from '@ember/service';
import translations from 'ember-intl/translations';
import type Store from '@ember-data/store';
import type IntlService from 'ember-intl/addon/services/intl';
import type SessionService from 'ember-simple-auth/services/session';
export class ApplicationRoute extends Route {
  @service session!: SessionService;
  @service store!: Store;
  @service intl!: IntlService

  async beforeModel() {
    await this.session.setup();

    const response = await fetch('/translations/en-us.json');
    const en = await response.json();

    translations.push(['en-us', en]);

    for (const [locale, translation] of translations) {
      this.intl.addTranslations(locale, translation);
    }
  }

  model() {
    console.log(this.store);

    return ['red', 'yellow', 'blue'];
  }
}
