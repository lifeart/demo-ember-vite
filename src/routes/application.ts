import Route from '@ember/routing/route';
import { service } from '@ember/service';
import translations from 'ember-intl/translations';
import SessionService from 'ember-simple-auth/addon/services/session';
import type IntlService from 'ember-intl/addon/services/intl';
import type Store from '@/services/store';

export class ApplicationRoute extends Route {
  @service session: SessionService;
  @service intl!: IntlService;
  @service store!: Store;

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

    const owner = this.store.createRecord('person', {
      id: '2',
      name: 'John Doe',
    });

    const pet = this.store.createRecord('pet', {
      name: 'Fluffy',
      id: '1',
    });

    console.log(owner, pet);
    // owner.dog = pet;

    return ['red', 'yellow', 'blue'];
  }
}
