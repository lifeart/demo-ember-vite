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
const calculateSummary = (a: number, b: number) => `${a}+${b}=${a + b}`;
export default class HelloWorld extends Component {
  @service('date') dateService!: DateService;
  @service('intl') intl!: IntlService;

  setLanguage = (language: string) => {
    this.intl.setLocale([language]);
  }

  static template = precompileTemplate(
    `
      <h1 class="hello-world">{{t 'hello.world'}}</h1>
      <pre class="font-mono">{{format-date this.dateService._date}} {{this.dateService.date}}</pre>

      {{if (eq "a" "a") "equal" "not equal"}}
      {{if (and (eq "a" "a") (eq "b" "b")) "equal" "not equal"}}

      <TemplateOnlyComponent />

      <Local />
      <br>
      {{calculateSummary 3 2}}
      <br>

      <Button {{on "click" (fn this.setLanguage "en-us")}}>en-us</Button>
      <Button {{on "click" (fn this.setLanguage "fr-fr")}}>fr-fr</Button>
      <Button {{on "click" (fn this.setLanguage "ru-ru")}}>ru-ru</Button>

      <Select />

      <Sample />
    `,
    {
      isStrictMode: true,
      scope: () => ({
        Local,
        Select,
        Sample,
        calculateSummary,
        TemplateOnlyComponent
      }),
    }
  );
}
