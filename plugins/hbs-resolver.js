const fileRegex = /\.(hbs)$/


function tpl(code, isComponent) {

    if (isComponent) {
        return `
        import { precompileTemplate } from '@ember/template-compilation';
        import { templateOnlyComponent } from '@glimmer/runtime';
        import { setComponentTemplate} from '@glimmer/manager';
        export default setComponentTemplate(precompileTemplate(${"`" + code + "`"}), templateOnlyComponent());
        `.trim();
    }
    
    return `
        import { precompileTemplate } from '@ember/template-compilation';
        export default precompileTemplate(${"`" + code + "`"});
    `.trim();
}

export default function hbsResolver() {
  return {
    name: 'hbs-resolver',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id, id)) {
        return {
          code: tpl(src, id.includes('/components/')),
          map: null, // provide source map if available
        }
      }
    },
  }
}