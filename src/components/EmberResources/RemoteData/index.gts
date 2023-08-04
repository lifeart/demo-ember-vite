// https://tutorial.glimdown.com/11-requesting-data/1-using-remote-data

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { RemoteData } from 'ember-resources/util/remote-data';

const urlFor = (id) => `https://swapi.dev/api/people/${id}`;

export default class Demo extends Component {
  @tracked id = 51;
  updateId = (event) => this.id = event.target.value;

  <template>
    <div class="border p-4 grid gap-4">
      <div>
        {{#let (RemoteData (urlFor this.id)) as |request|}}
          {{#if request.isLoading}}
            ... loading {{this.id}} ...
          {{else if request.value}}
            {{request.value.name}}
          {{/if}}
        {{/let}}
      </div>

      <label>
        Person ID
        <input
          type='number'
          class='border px-3 py-2'
          value={{this.id}}
          {{on 'input' this.updateId}}>
      </label>
    </div>
  </template>
}
