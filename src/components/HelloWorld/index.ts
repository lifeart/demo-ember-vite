import Component from "@glimmer/component/addon/-private/component";
import { tracked } from "./../../config/ember";
import { precompileTemplate } from "@ember/template-compilation";
import Local from "./local";
import "./style.css";
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
    `,
    {
      isStrictMode: true,
      scope: () => ({
        Local,
      }),
    }
  );
}
