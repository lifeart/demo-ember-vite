import type { IRegistry } from './utils';
import addonsRegistry from '@/addons';


/* imported routes */
import { ApplicationRoute } from '../routes/application';
import LoginRoute from '../routes/login';
import LogoutRoute from '../routes/logout';
// import { MainRoute } from '../routes/main';

/* imported authenticators */
import CustomAuthenticator from '../authenticators/custom';

/* imported controllers */
import { ApplicationController } from '@/controllers/application';
import { LoginController } from '@/controllers/login';

/* imported templates */
import ApplicationTemplate from '@/templates/application.hbs';
import AboutTemplate from '@/templates/about.hbs';
import LoginTemplate from '@/templates/login.hbs';

/* imported services */
import DateService from '@/services/date';

/* imported components */
import HelloWorld from '@/components/HelloWorld';
import Button from '@/components/Button';

/* imported helpers */
import MemoryUsage from '@/helpers/memory-usage';

/* imported modifiers */
import ClickTracker from '@/modifiers/click-tracker';

export const InitialRegistry = {
  ...addonsRegistry,
  'authenticator:custom': CustomAuthenticator,
  'service:date': DateService,
  'controller:application': ApplicationController,
  'controller:login': LoginController,
  'route:application': ApplicationRoute,

  'route:login': LoginRoute,
  'route:logout': LogoutRoute,

  'template:application': ApplicationTemplate,
  'template:about': AboutTemplate,
  'template:login': LoginTemplate,

  'component:hello-world': HelloWorld,
  'component:button': Button,

  'helper:memory-usage': MemoryUsage as unknown as () => string, // glint fix
  'modifier:click-tracker': ClickTracker,

  /* embroider compatibility */

  'helper:ensure-safe-component': function (a: string) {
    return a;
  },
  'helper:macroCondition': function (a: string) {
    if (a === 'isNotBS5') {
      return false;
    }
    console.log('macroCondition', a);
    return a;
  },
  'helper:macroGetOwnConfig': function (a: string) {
    console.log('macroGetOwnConfig', a);
    return a;
  },
};

function registry(): IRegistry {
  return InitialRegistry;
}

export default registry;
