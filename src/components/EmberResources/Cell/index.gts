// https://tutorial.glimdown.com/2-reactivity/4-functions

import Component from '@glimmer/component';
import { cell } from 'ember-resources';

const greeting = cell("Hello there!");

// Change the value after 3 seconds
setTimeout(() => {
  greeting.current = "General Kenobi!";
}, 3000);

export default class CellComponent extends Component {
  <template>
    Greeting: {{greeting.current}}
  </template>
}
