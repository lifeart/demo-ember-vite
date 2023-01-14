import { preprocessEmbeddedTemplates } from 'ember-template-imports/lib/preprocess-embedded-templates';
import { getTemplateLocals } from '@glimmer/syntax';
import * as util from 'ember-template-imports/lib/util';

const fileRegex = /\.(gts|gjs)$/


function tpl(raw, id) {

    const result = preprocessEmbeddedTemplates(raw, {
        getTemplateLocals,
        relativePath: id,
        templateTag: util.TEMPLATE_TAG_NAME,
        templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
        includeSourceMaps: false,
        importIdentifier: util.TEMPLATE_LITERAL_IDENTIFIER,
        importPath: util.TEMPLATE_LITERAL_MODULE_SPECIFIER,
        includeTemplateTokens: true,
    });
    return result.output;
}

export default function hbsResolver() {
  return {
    name: 'gts-resolver',
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