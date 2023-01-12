import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';

export default class Button extends Component {
    static template = precompileTemplate(`
        <button type="button" class="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" ...attributes>{{yield}}</button>
    `)
}