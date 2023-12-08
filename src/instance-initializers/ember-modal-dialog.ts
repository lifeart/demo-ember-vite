import initialize from 'ember-modal-dialog/instance-initializers/add-modals-container.js';
import type ApplicationInstance from '@ember/application/instance';

export default {
  name: 'add-modals-container',
  initialize: function (application: ApplicationInstance) {
    console.log('instance initializer init');
    initialize(application);
  },
};
