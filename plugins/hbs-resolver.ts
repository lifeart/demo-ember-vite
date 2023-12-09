import type { Plugin } from 'vite';

const fileRegex = /\.(hbs)$/;

function tpl(raw: string, id: string, isProd: boolean) {
  const code = raw.split('`').join('\\`');

  const moduleName = id.includes('node_modules')
    ? id.split('node_modules/')[1]
    : id.split('src').pop();

  const name =
    moduleName?.split('/components/').pop()?.split('.')[0] ?? 'unknown';
  // we always want to return a template-only component
  // and corner-cases handled by patched ember-source, and glimmer

  return `
    import { precompileTemplate } from '@ember/template-compilation';
    import { templateOnlyComponent } from '@glimmer/runtime';
    import { setComponentTemplate} from '@glimmer/manager';
    export default setComponentTemplate(precompileTemplate(${'`' + code + '`'}${
    isProd ? ', {isProduction: true}' : ''
  }), templateOnlyComponent("${moduleName}", "${name}"));
    `.trim();

  // return `
  //     import { precompileTemplate } from '@ember/template-compilation';
  //     export default precompileTemplate(${"`" + code + "`"});
  // `.trim();
}

export default function hbsResolver(isProd: boolean): Plugin {
  return {
    name: 'hbs-resolver',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: tpl(src, id, isProd),
          map: null, // provide source map if available
        };
      } else {
        return void 0;
      }
    },
  };
}
