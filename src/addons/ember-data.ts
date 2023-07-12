// ember-data debug adapter
import DataDebugAdapter from '@ember-data/debug';
import StoreService from '@/services/store';
/* ember-data stuff */
import Pet from '@/models/pet';
import Person from '@/models/person';

const registry = {
  'service:store': StoreService,
  'model:pet': Pet,
  'model:person': Person,
  // debug ember-data adapter
  'data-adapter:main': DataDebugAdapter,
};

export default registry;
