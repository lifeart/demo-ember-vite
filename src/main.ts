import 'vite/modulepreload-polyfill';
import '@glint/environment-ember-loose';
import './style.css';

import Ember from 'ember';
import App from '@/config/application';
import { init } from '@/config/initializer';
import { setupApplicationGlobals } from '@/config/helpers';
import { extendRegistry } from '@/config/utils';
import env from '@/config/env';
import Router from './router';

import '@/config/inspector';

setupApplicationGlobals(Ember);

const app = init(App, Router);

window[env.APP.globalName] = app; // for debugging and experiments

import('@/addons')
  .then(({ default: addons }) => {
    // here we importing static addons registry
    // and extend app registry with it
    // we need to not grow main bundle
    extendRegistry(addons);
  })
  .then(() => {
    app.visit(window.location.pathname).then(() => {
      document.querySelector('.lds-ripple')?.remove();
    });
    console.log(app);
  });
