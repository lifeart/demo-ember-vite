import Component from '@glimmer/component';
import { service } from '@ember/service';
import { precompileTemplate } from '@ember/template-compilation';
import Local from './local';
import type DateService from '@/services/date';
import TemplateOnlyComponent from '@/components/OnlyTemplate/component.hbs';
import './style.css';
import Select from '@/components/Select';
import Sample from './sample.gts';
import type IntlService from 'ember-intl/addon/services/intl';
import Cell from '../EmberResources/Cell/index.gts';
import Resource from '../EmberResources/Resource/index.gts';
import ResourceFactory from '../EmberResources/ResourceFactory/index.gts';
import RemoteData from '../EmberResources/RemoteData/index.gts';

const calculateSummary = (a: number, b: number) => `${a}+${b}=${a + b}`;
export default class HelloWorld extends Component {
  @service('date') dateService!: DateService;
  @service('intl') intl!: IntlService;

  setLanguage = (language: string) => {
    this.intl.setLocale([language]);
  };

  static template = precompileTemplate(
    `

    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900"><code>t</code> helper test:</h3>

      <div class="mt-2" data-test-welcome-msg>
        {{t 'hello.world'}}
      </div>
      <div class="mt-4">
      <Button data-test-lang="en-us" {{on "click" (fn this.setLanguage "en-us")}}>en-us</Button>
      <Button data-test-lang="fr-fr" {{on "click" (fn this.setLanguage "fr-fr")}}>fr-fr</Button>
      <Button data-test-lang="ru-ru" {{on "click" (fn this.setLanguage "ru-ru")}}>ru-ru</Button>
      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
      Reactivity test:
      </h3>

      <div class="mt-2">
      <pre class="font-mono">{{format-date this.dateService._date}} {{this.dateService.date}}</pre>

      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">

        <code>eq</code>, <code>and</code> helpers test:
      </h3>

      <div class="mt-2">
      {{if (eq "a" "a") "equal" "not equal"}}
        {{if (and (eq "a" "a") (eq "b" "b")) "equal" "not equal"}}
      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Template only component test:</h3>

      <div class="mt-2">
        <TemplateOnlyComponent />
      </div>
    </div>

    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Local imported component:</h3>

      <div class="mt-2">
      <Local />
      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Summary calculation helper test:</h3>

      <div class="mt-2">
      {{calculateSummary 3 2}}
      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Ember Power Select test:</h3>

      <div class="mt-2">
      <Select />
      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">.gts component test:</h3>

      <div class="mt-2">
      <Sample />
      </div>
    </div>


    <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">ember-resources</h3>

      <h4 class="text-md mt-2 font-medium leading-5">Cell</h4>
      <Cell />

      <h4 class="text-md mt-2 font-medium leading-5">Resource</h4>
      <Resource />

      <h4 class="text-md mt-2 font-medium leading-5">ResourceFactory</h4>
      <ResourceFactory />

      <h4 class="text-md mt-2 font-medium leading-5">RemoteData</h4>
      <RemoteData />
    </div>

    `,
    {
      isStrictMode: true,
      scope: () => ({
        Local,
        Select,
        Sample,
        calculateSummary,
        TemplateOnlyComponent,
        Cell,
        Resource,
        ResourceFactory,
        RemoteData,
      }),
    }
  );
}
