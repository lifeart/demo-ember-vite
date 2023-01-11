import { precompileTemplate } from '@ember/template-compilation';


export default precompileTemplate(`
<h1>Ember Application</h1>

<HelloWorld />

<ul>
    {{#each this.model as |item|}}
        <li>{{item}}</li>
    {{/each}}
</ul>
`);