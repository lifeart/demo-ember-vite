import '@glint/environment-ember-loose';
import './style.css';

import Ember from './config/ember';
import App from './config/application';
import Router from './router';
import { init } from './config/initializer';
import { setupApplicationGlobals } from './config/helpers';
import env from './config/env';

setupApplicationGlobals(Ember);

const app = init(App, Router);

app.visit(window.location.pathname).then(() => {
  document.querySelector('.lds-ripple')?.remove();
});

window[env.APP.globalName] = app; // for debugging and experiments

console.log(app);
