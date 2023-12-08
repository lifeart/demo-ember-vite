import { setComponentTemplate } from '@glimmer/manager';
import ModalDialogComponent from 'ember-modal-dialog/components/modal-dialog.js';
import ModalDialogTemplate from 'ember-modal-dialog/templates/components/modal-dialog.hbs';
import ModalDialogService from 'ember-modal-dialog/app/services/modal-dialog.js';

import ModalDialogBasicDialogComponent from 'ember-modal-dialog/components/basic-dialog.js';
import ModalDialogBasicDialogTemplate from 'ember-modal-dialog/templates/components/basic-dialog.hbs';

import EmberWormholeComponent from 'ember-wormhole/addon/components/ember-wormhole.js';
import EmberWormholeTemplate from 'ember-wormhole/addon/templates/components/ember-wormhole.hbs';

import IgnoreChildren from 'ember-modal-dialog/helpers/ignore-children.js';

import PositionedContainerComponent from 'ember-modal-dialog/components/positioned-container.js';

import 'ember-modal-dialog/app/styles/ember-modal-dialog/ember-modal-appearance.css';
import 'ember-modal-dialog/app/styles/ember-modal-dialog/ember-modal-structure.css';

setComponentTemplate(
  ModalDialogBasicDialogTemplate,
  ModalDialogBasicDialogComponent
);

const registry = {
  'component:modal-dialog': setComponentTemplate(
    ModalDialogTemplate,
    ModalDialogComponent
  ),
  'component:ember-wormhole': setComponentTemplate(
    EmberWormholeTemplate,
    EmberWormholeComponent
  ),
  'component:ember-modal-dialog-positioned-container':
    PositionedContainerComponent,
  'service:modal-dialog': ModalDialogService,
  'helper:ignore-children': IgnoreChildren,
};

export default registry;
