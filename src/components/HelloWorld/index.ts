import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { precompileTemplate } from "@ember/template-compilation";
import Local from "./local";
import "./style.css";

const myHelper = (a: number, b: number) => a + b;
export default class HelloWorld extends Component {
  @tracked _date = new Date().toString();
  constructor() {
    super(...arguments);
    setInterval(() => {
      this._date = new Date().toString();
    }, 1000);
  }
  get date() {
    return this._date;
  }
  static template = precompileTemplate(
    `
        <h1 class="hello-world">Hello World (from component)</h1>
        <pre>{{this.date}}</pre>
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
