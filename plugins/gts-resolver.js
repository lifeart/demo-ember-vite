import { Preprocessor } from 'content-tag';

const p = new Preprocessor();
const fileRegex = /\.(gts|gjs)$/;

function tpl(raw, id) {
  const result = p.process(raw, id);
  // console.log(result);
  return result;
  //result.output.replace('strictMode: true', 'isStrictMode: true');
}

function hotLoad(id) {
  return `
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      const moduleName = '${id}';
      window.dispatchEvent(
        new CustomEvent('hot-reload', {
          detail: {
            moduleName,
            component: newModule.default,
          },
        })
      );
    });
  }`;
}

export default function hbsResolver(isProd) {
  return {
    name: 'gts-resolver',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id, id)) {
        return {
          code: isProd ? tpl(src, id) : tpl(src, id) + hotLoad(id),
          map: null, // provide source map if available
        };
      }
    },
  };
}
