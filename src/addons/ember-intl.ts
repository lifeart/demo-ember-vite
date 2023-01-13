import FormatDateHelper from 'ember-intl/addon/helpers/format-date';
import THelper from 'ember-intl/addon/helpers/t';
import intl from 'ember-intl/addon/services/intl';
import MissingMessage from 'ember-intl/app/utils/intl/missing-message';

const registry = {
  'helper:format-date': FormatDateHelper,
  'helper:t': THelper,
  'service:intl': intl,
  'util:intl/missing-message': MissingMessage,
}

export default registry;
