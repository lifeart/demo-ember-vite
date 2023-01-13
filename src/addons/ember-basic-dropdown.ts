import 'ember-basic-dropdown/vendor/ember-basic-dropdown.css';

import EmberBasicDropdownComponent from 'ember-basic-dropdown/addon/components/basic-dropdown';
import EmberBasicDropdownTemplate from 'ember-basic-dropdown/addon/components/basic-dropdown.hbs';
import EmberBasicDropdownTriggerComponent from 'ember-basic-dropdown/addon/components/basic-dropdown-trigger';
import EmberBasicDropdownTriggerTemplate from 'ember-basic-dropdown/addon/components/basic-dropdown-trigger.hbs';
import BasicDropdownTriggerModifier from 'ember-basic-dropdown/addon/modifiers/basic-dropdown-trigger';
import EmberBasicDropdownContentComponent from 'ember-basic-dropdown/addon/components/basic-dropdown-content';
import EmberBasicDropdownContentTemplate from 'ember-basic-dropdown/addon/components/basic-dropdown-content.hbs';

import { setComponentTemplate} from '@glimmer/manager';

const registry = {
    'modifier:basic-dropdown-trigger': BasicDropdownTriggerModifier,
    'component:basic-dropdown': setComponentTemplate(EmberBasicDropdownTemplate, EmberBasicDropdownComponent),
    'component:basic-dropdown-trigger': setComponentTemplate(EmberBasicDropdownTriggerTemplate, EmberBasicDropdownTriggerComponent),
    'component:basic-dropdown-content': setComponentTemplate(EmberBasicDropdownContentTemplate, EmberBasicDropdownContentComponent),

}

export default registry;