import 'ember-power-select/vendor/ember-power-select.css';

import EmberPowerSelectComponent from 'ember-power-select/addon/components/power-select';
import EmberPowerSelectTemplate from 'ember-power-select/addon/components/power-select.hbs';
import EmberPowerSelectTriggerComponent from 'ember-power-select/addon/components/power-select/trigger';
import EmberPowerSelectTriggerTemplate from 'ember-power-select/addon/components/power-select/trigger.hbs';
import EmberPowerSelectPlaceholderComponent from 'ember-power-select/addon/components/power-select/placeholder.hbs';
import EmberPowerSelectBeforeOptionsComponent from 'ember-power-select/addon/components/power-select/before-options';
import EmberPowerSelectBeforeOptionsTemplate from 'ember-power-select/addon/components/power-select/before-options.hbs';
import EmberPowerSelectOptionsComponent from 'ember-power-select/addon/components/power-select/options';
import EmberPowerSelectOptionsTemplate from 'ember-power-select/addon/components/power-select/options.hbs';

import EmberPowerSelectIsGroupHelper from 'ember-power-select/addon/helpers/ember-power-select-is-group';
import EmberPowerSelectIsSelectedHelper from 'ember-power-select/addon/helpers/ember-power-select-is-selected';

import { setComponentTemplate} from '@glimmer/manager';

const registry = {
    'component:power-select': setComponentTemplate(EmberPowerSelectTemplate, EmberPowerSelectComponent),
    'component:power-select/trigger': setComponentTemplate(EmberPowerSelectTriggerTemplate, EmberPowerSelectTriggerComponent),
    'component:power-select/placeholder': EmberPowerSelectPlaceholderComponent,
    'component:power-select/before-options': setComponentTemplate(EmberPowerSelectBeforeOptionsTemplate, EmberPowerSelectBeforeOptionsComponent),
    'component:power-select/options': setComponentTemplate(EmberPowerSelectOptionsTemplate, EmberPowerSelectOptionsComponent),
    'helper:ember-power-select-is-group': EmberPowerSelectIsGroupHelper,
    'helper:ember-power-select-is-selected': EmberPowerSelectIsSelectedHelper,
}

export default registry;