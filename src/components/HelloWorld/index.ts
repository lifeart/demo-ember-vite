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
import Cell from '@/components/EmberResources/Cell/index.gts';
import Resource from '@/components/EmberResources/Resource/index.gts';
import ResourceFactory from '@/components/EmberResources/ResourceFactory/index.gts';
import RemoteData from '@/components/EmberResources/RemoteData/index.gts';
import FeaturePanel from '@/components/FeaturePanel/index.gts';

const calculateSummary = (a: number, b: number) => `${a}+${b}=${a + b}`;
export default class HelloWorld extends Component {
  @service('date') dateService!: DateService;
  @service('intl') intl!: IntlService;

  setLanguage = (language: string) => {
    this.intl.setLocale([language]);
  };

  static template = precompileTemplate(
    `

    <FeaturePanel>
      <:title><code>t</code> helper test:</:title>
      <:description>
        <div class="mt-2" data-test-welcome-msg>
          {{t 'hello.world'}}
        </div>
        <div class="mt-4">
        <Button data-test-lang="en-us" {{on "click" (fn this.setLanguage "en-us")}}>en-us</Button>
        <Button data-test-lang="fr-fr" {{on "click" (fn this.setLanguage "fr-fr")}}>fr-fr</Button>
        <Button data-test-lang="ru-ru" {{on "click" (fn this.setLanguage "ru-ru")}}>ru-ru</Button>
        </div>
      </:description>
    </FeaturePanel>
   
    <FeaturePanel>
      <:title>Reactivity test:</:title>
      <:description>
        <pre class="font-mono">{{format-date this.dateService._date}} {{this.dateService.date}}</pre>
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title><code>eq</code>, <code>and</code> helpers test:</:title>
      <:description>
        {{if (eq "a" "a") "equal" "not equal"}}
        {{if (and (eq "a" "a") (eq "b" "b")) "equal" "not equal"}}
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title>Template only component test:</:title>
      <:description>
        <TemplateOnlyComponent />
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title>Local imported component:</:title>
      <:description>
        <Local />
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title>Summary calculation helper test:</:title>
      <:description>
        {{calculateSummary 3 2}}
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title>Ember Power Select test:</:title>
      <:description>
        <Select />
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title>.gts component test:</:title>
      <:description>
        <Sample />
      </:description>
    </FeaturePanel>

    <FeaturePanel>
      <:title>ember-resources</:title>
      <:description>
        <h4 class="text-md mt-2 font-medium leading-5">Cell</h4>
        <Cell />

        <h4 class="text-md mt-2 font-medium leading-5">Resource</h4>
        <Resource />

        <h4 class="text-md mt-2 font-medium leading-5">ResourceFactory</h4>
        <ResourceFactory />

        <h4 class="text-md mt-2 font-medium leading-5">RemoteData</h4>
        <RemoteData />
      </:description>
    </FeaturePanel>

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
        FeaturePanel,
      }),
    }
  );
}
