import './style.css'

import Ember from './config/ember';
import App from './config/application';
import { init } from './config/initializer';
import { setupApplicationGlobals } from './config/helpers';

setupApplicationGlobals(Ember);

const MyApp = init(App);

MyApp.visit('/');

console.log(MyApp);

