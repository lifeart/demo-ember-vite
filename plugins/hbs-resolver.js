const fileRegex = /\.(hbs)$/


function tpl(raw) {

    const code = raw.split('`').join('\\`');

    // we always want to return a template-only component
    // and corner-cases handled by patched ember-source, and glimmer
    
    return `
    import { precompileTemplate } from '@ember/template-compilation';
    import { templateOnlyComponent } from '@glimmer/runtime';
    import { setComponentTemplate} from '@glimmer/manager';
    export default setComponentTemplate(precompileTemplate(${"`" + code + "`"}), templateOnlyComponent());
    `.trim();
    
    // return `
    //     import { precompileTemplate } from '@ember/template-compilation';
    //     export default precompileTemplate(${"`" + code + "`"});
    // `.trim();
}

export default function hbsResolver() {
  return {
    name: 'hbs-resolver',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id, id)) {
        return {
          code: tpl(src, id),
          map: null, // provide source map if available
        }
      }
    },
  }
}