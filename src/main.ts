import './style.css'

import Ember from './config/ember';
import App from './config/application';
import Router from './router';
import { init } from './config/initializer';
import { setupApplicationGlobals } from './config/helpers';

setupApplicationGlobals(Ember);

const MyApp = init(App, Router);

MyApp.visit(window.location.pathname);

console.log(MyApp);

