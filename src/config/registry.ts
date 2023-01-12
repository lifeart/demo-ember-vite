/* imported routes */
import { ApplicationRoute } from '../routes/application';
// import { MainRoute } from '../routes/main';

/* imported controllers */
import { ApplicationController } from '../controllers/application';

/* imported templates */
import ApplicationTemplate from '../templates/application';
import AboutTemplate from '../templates/about';

/* imported services */
import DateService from '../services/date';

/* imported components */
import HelloWorld from '../components/HelloWorld';
import Button from '../components/Button';

/* imported helpers */
import MemoryUsage from '../helpers/memory-usage';

/* imported modifiers */
import ClickTracker from '../modifiers/click-tracker';

import { IRegistry } from './utils';

import addonsRegistry from './../addons';

function registry(): IRegistry {
  return {
    ...addonsRegistry,
    'service:date': DateService,
    'controller:application': ApplicationController,
    'route:application': ApplicationRoute,
    'template:application': ApplicationTemplate,
    'template:about': AboutTemplate,
    'component:hello-world': HelloWorld,
    'component:button': Button,
    'helper:memory-usage': MemoryUsage,
    'modifier:click-tracker': ClickTracker,
  };
}

export default registry;
