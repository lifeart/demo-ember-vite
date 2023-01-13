import FormatDateHelper from 'ember-intl/addon/helpers/format-date';
import EmberIntlService from 'ember-intl/addon/services/intl';
import EmberTHelper from 'ember-intl/addon/helpers/t';
import EmberMissingMessage from 'ember-intl/addon/-private/utils/missing-message';

const registry = {
  'helper:format-date': FormatDateHelper,
  'service:intl': EmberIntlService,
  'helper:t': EmberTHelper,
  'util:intl/missing-message': EmberMissingMessage,
};

export default registry;
