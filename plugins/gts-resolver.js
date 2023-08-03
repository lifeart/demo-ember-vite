import { Preprocessor } from 'content-tag';

const p = new Preprocessor();
const fileRegex = /\.(gts|gjs)$/;

function tpl(raw, id) {
  return p.process(raw, id);
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
        };
      }
    },
  };
}
