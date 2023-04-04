import { precompileTemplate } from '@ember/template-compilation';
import Bootstrap from '../components/Bootstrap';
import EmberBootstrapRegistry from './../addons/ember-bootstrap';
import { extendRegistry } from '@/config/utils';
extendRegistry(EmberBootstrapRegistry);

export default precompileTemplate(
  `
    {{page-title "Bootstrap"}}
    <LinkTo @route='main'>Home</LinkTo>
   <Bootstrap />
`,
  { isStrictMode: true, scope: () => ({ Bootstrap }) }
);
