import type { IRegistry } from './utils';

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
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/* imported helpers */
import MemoryUsage from '@/helpers/memory-usage';
import IsDev from '@/helpers/is-dev';

/* imported modifiers */
import ClickTracker from '@/modifiers/click-tracker';

export const InitialRegistry = {
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
  'component:header': Header,
  'component:footer': Footer,

  'helper:memory-usage': MemoryUsage as unknown as () => string, // glint fix
  'helper:is-dev': IsDev,

  'modifier:click-tracker': ClickTracker,

  /* embroider compatibility */

  'helper:ensure-safe-component': function (a: string) {
    return a;
  },
  'helper:macroCondition': function (a: string) {
    // ember-bootstrap compat
    if (typeof a === 'boolean') {
      return a;
    }
    console.log('macroCondition', a);
    return a;
  },
  'helper:macroGetOwnConfig': function (a: string) {
    // ember-bootstrap compat
    if (a === 'isNotBS5') {
      return false;
    }
    if (a === 'isBS5') {
      return true;
    }
    if (a === 'isBS4') {
      return false;
    }
    console.log('macroGetOwnConfig', a);
    return a;
  },
};

function registry(): IRegistry {
  return InitialRegistry;
}

export default registry;
