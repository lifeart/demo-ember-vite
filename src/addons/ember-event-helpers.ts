import PreventDefaultHelper from 'ember-event-helpers/addon/helpers/prevent-default.js';
import StopPropagationHelper from 'ember-event-helpers/addon/helpers/stop-propagation.js';

const registry = {
  'helper:prevent-default': PreventDefaultHelper,
  'helper:stop-propagation': StopPropagationHelper,
};

export default registry;
