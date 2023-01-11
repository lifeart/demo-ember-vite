import Component from "@glimmer/component";
import { service } from "@ember/service";
import { precompileTemplate } from "@ember/template-compilation";
import Local from "./local";
import "./style.css";
import DateService from "../../services/date";

const myHelper = (a: number, b: number) => a + b;
export default class HelloWorld extends Component {
  @service('date') dateService!: DateService;
  static template = precompileTemplate(
    `
        <h1 class="hello-world">Hello World (from component)</h1>
        <pre>{{this.dateService.date}}</pre>
        <Local />
        <br>
        3+2={{myHelper 3 2}}
        <br>
    `,
    {
      isStrictMode: true,
      scope: () => ({
        Local,
        myHelper,
      }),
    }
  );
}
