import EmberSimpleAuthRegistry from './ember-simple-auth';
import EmberTruthHelpers from './ember-truth-helpers';
import EmberPowerSelect from './ember-power-select';
import EmberBasicDropdown from './ember-basic-dropdown';
import EmberAssignHelper from './ember-assign-helper';
import EmberElementHelper from './ember-element-helper';
import EmberRenderModifiers from './ember-render-modifiers';
import EmberStyleModifier from './ember-style-modifier';
import EmberIntl from './ember-intl';
import EmberPageTitle from './ember-page-title';
import EmberData from './ember-data';
import EmberNotify from './ember-notify';
import EmberModalDialog from './ember-modal-dialog';
import EmberResponsive from './ember-responsive';
import EmberEventHelpers from './ember-event-helpers';

const registry = {
  ...EmberSimpleAuthRegistry,
  ...EmberTruthHelpers,
  ...EmberBasicDropdown,
  ...EmberAssignHelper,
  ...EmberRenderModifiers,
  ...EmberElementHelper,
  ...EmberStyleModifier,
  ...EmberPowerSelect,
  ...EmberIntl,
  ...EmberPageTitle,
  ...EmberData,
  ...EmberNotify,
  ...EmberModalDialog,
  ...EmberResponsive,
  ...EmberEventHelpers,
};

export default registry;
