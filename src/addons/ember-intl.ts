import EmberIntlService from 'ember-intl/addon/services/intl';
import EmberTHelper from 'ember-intl/addon/helpers/t';
import EmberMissingMessage from 'ember-intl/addon/-private/utils/missing-message';
import translations from '../../translations';

class Service extends EmberIntlService {
    init() {
        super.init();
        translations.forEach(([locale, translations]) => {
            this.addTranslations(locale, translations);
        });
    }
}

const registry = {
    'service:intl': Service,
    'helper:t': EmberTHelper,
    'util:intl/missing-message': EmberMissingMessage,
}

export default registry;