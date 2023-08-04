// https://tutorial.glimdown.com/2-reactivity/5-resources

import Component from '@glimmer/component';
import { resource, cell } from 'ember-resources';

const Clock = resource(({ on }) => {
  let time = cell(new Date());
  let interval = setInterval(() => time.current = new Date(), 1000);

  on.cleanup(() => clearInterval(interval));

  return time;
});

export default class ResourceComponent extends Component {
  <template>
    It is: <time>{{Clock}}</time>
  </template>
}
