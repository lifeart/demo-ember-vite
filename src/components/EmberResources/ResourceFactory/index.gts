// https://tutorial.glimdown.com/2-reactivity/6-resource-builders

import Component from '@glimmer/component';
import { resource, cell, resourceFactory } from 'ember-resources';

const Clock = resourceFactory((locale = 'en-US') => {
  let formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return resource(({ on }) => {
    let time = cell(new Date());
    let interval = setInterval(() => time.current = new Date(), 1000);

    on.cleanup(() => clearInterval(interval));

    return () => formatter.format(time.current);
  });
});

export default class ResourceFactoryComponent extends Component {
  <template>
    It is: <time>{{Clock}}</time><br />
    It is: <time>{{Clock 'en-GB'}}</time><br />
    It is: <time>{{Clock 'ko-KO'}}</time><br />
    It is: <time>{{Clock 'ja-JP-u-ca-japanese'}}</time>
  </template>
}
