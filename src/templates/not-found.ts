import { precompileTemplate } from '@ember/template-compilation';

const currentPath = () => window.location.pathname;

export default precompileTemplate(`
   <h1>Woops</h1>
   <p>Page not found</p>
   <p>looks like you visited not-found route</p>
    <p>Current path: {{currentPath}}</p>
   <p>Try to visit <LinkTo @route="main">main</LinkTo> route</p>
`, { isStrictMode: true, scope: () => ({currentPath})});