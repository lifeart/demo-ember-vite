import { Preprocessor } from 'content-tag';
import type { Plugin } from 'vite';

const p = new Preprocessor();
const fileRegex = /\.(gts|gjs)$/;

function tpl(raw: string, id: string) {
  return p.process(raw, id);
}

export default function hbsResolver(): Plugin {
  return {
    name: 'gts-resolver',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: tpl(src, id),
          map: null, // provide source map if available
        };
      } else {
        return void 0;
      }
    },
  };
}
