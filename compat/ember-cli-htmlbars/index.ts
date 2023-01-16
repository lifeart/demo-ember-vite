import Ember from 'ember';

export function hbs(tpl) {
  window._Ember = Ember;
  return window.compile(tpl[0]);
}
