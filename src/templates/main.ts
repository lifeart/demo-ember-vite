import { precompileTemplate } from '@ember/template-compilation';


export default precompileTemplate(`
    <h1>Ember Application</h1>

    <HelloWorld />

    <a href="https://github.com/lifeart/demo-ember-vite">Repo</a> |
    <LinkTo @route="about">About</LinkTo>
    |
    <LinkTo @route="not-found" @model="404">404</LinkTo>
    |
    <a href="/tests/">Tests (QUnit)</a>
    |
    <LinkTo @route="profile">Profile</LinkTo>

    <ul>
        {{#each this.model as |item|}}
            <li>{{item}}</li>
        {{/each}}
    </ul>

    {{memory-usage}}
`);
