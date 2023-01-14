/* imported routes */
import { ApplicationRoute } from '../routes/application';
// import { MainRoute } from '../routes/main';

/* imported authenticators */
import CustomAuthenticator from '../authenticators/custom';

/* imported controllers */
import { ApplicationController } from '../controllers/application';
import { LoginController } from '../controllers/login';

/* imported templates */
import ApplicationTemplate from '../templates/application';
import AboutTemplate from '../templates/about';
import LoginTemplate from '../templates/login';

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
    'authenticator:custom': CustomAuthenticator,
    'service:date': DateService,
    'controller:application': ApplicationController,
    'controller:login': LoginController,
    'route:application': ApplicationRoute,
    'template:application': ApplicationTemplate,
    'template:about': AboutTemplate,
    'template:login': LoginTemplate,
    'component:hello-world': HelloWorld,
    'component:button': Button,
    'helper:ensure-safe-component': function(a) {
      return a;
    },
    'helper:memory-usage': MemoryUsage,
    'modifier:click-tracker': ClickTracker,
  };
}

export default registry;
