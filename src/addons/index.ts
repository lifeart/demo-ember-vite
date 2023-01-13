import EmberTruthHelpers from './ember-truth-helpers';
import EmberPowerSelect from './ember-power-select';
import EmberBasicDropdown from './ember-basic-dropdown';
import EmberAssignHelper from './ember-assign-helper';
import EmberElementHelper from './ember-element-helper';
import EmberRenderModifiers from './ember-render-modifiers';
import EmberStyleModifier from './ember-style-modifier';
import EmberIntl from './ember-intl';

const registry = {
    ...EmberTruthHelpers,
    ...EmberBasicDropdown,
    ...EmberAssignHelper,
    ...EmberRenderModifiers,
    ...EmberElementHelper,
    ...EmberStyleModifier,
    ...EmberPowerSelect,
    ...EmberIntl
}

export default registry;
