import 'ember-notify/vendor/ember-notify.css';

import NotifyService from 'ember-notify/index.js';
import EmberNotifyComponent from 'ember-notify/components/ember-notify.js';
import EmberNotifyComponentTemplate from 'ember-notify/templates/components/ember-notify.hbs';
import EmberNotifyMessageComponent from 'ember-notify/components/ember-notify/message.js';
import EmberNotifyMessageComponentTemplate from 'ember-notify/templates/components/ember-notify/message.hbs';
import { setComponentTemplate } from '@glimmer/manager';

const registry = {
  'service:notify': NotifyService,
  'component:ember-notify': setComponentTemplate(
    EmberNotifyComponentTemplate,
    EmberNotifyComponent
  ),
  'component:ember-notify/message': setComponentTemplate(
    EmberNotifyMessageComponentTemplate,
    EmberNotifyMessageComponent
  ),
};

export default registry;
