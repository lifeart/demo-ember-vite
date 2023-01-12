import Component from "@glimmer/component";
import { service } from "@ember/service";
import { precompileTemplate } from "@ember/template-compilation";
import Local from "./local";
import type DateService from "../../services/date";
import "./style.css";


const calculateSummary = (a: number, b: number) => `${a}+${b}=${a + b}`;
export default class HelloWorld extends Component {
  @service('date') dateService!: DateService;
  static template = precompileTemplate(
    `
        <h1 class="hello-world">Hello World (from component)</h1>
        <pre class="font-mono">{{this.dateService.date}}</pre>
        <Local />
        <br>
        {{calculateSummary 3 2}}
        <br>
    `,
    {
      isStrictMode: true,
      scope: () => ({
        Local,
        calculateSummary,
      }),
    }
  );
}
