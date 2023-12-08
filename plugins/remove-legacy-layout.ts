export function removeLegacyLayout(addons: string[]) {
  return function removeLegacyLayoutPlugin (babel) {
    const shouldContinue = (state) => {
      const fName = state.file.opts.filename;
      return (
        fName.includes('node_modules') &&
        addons.some((el) => fName.includes(`/${el}/`))
      );
    };
    const { types: t } = babel;
    return {
      name: 'remove-layout',
      visitor: {
        Program: {
          exit(path, state) {
            if (state.shouldAppendLayout) {
              path.node.body.push(
                t.variableDeclaration('var', [
                  t.variableDeclarator(
                    t.identifier('layout'),
                    t.stringLiteral('')
                  ),
                ])
              );
            }
          },
        },
        ImportDeclaration(path, state) {
          if (!shouldContinue(state)) {
            return;
          }
          if (path.node.source.value.endsWith('/config/environment')) {
            path.node.source.value = '@/config/env';
          }
          if (path.node.source.value === '@ember-decorators/component') {
            //   path.node.specifiers = path.node.specifiers.filter((el) => {
            //     return el.imported.name !== 'layout';
            //   });
            //   if (!path.node.specifiers.length) {
            //     path.remove();
            //   }
            path.node.source.value = 'compat-ember-decorators/component';
          } else if (path.node.source.value.includes('/templates/')) {
            path.remove();
            // add `layout` variable to programm
            state.shouldAppendLayout = true;
          }
        },
        ObjectProperty(path, state) {
          if (!shouldContinue(state)) {
            return;
          }
          if (
            path.node.value.name === 'layout' &&
            path.node.key.name === 'layout'
          ) {
            path.remove();
          }
        },
        ClassProperty(path, state) {
          if (!shouldContinue(state)) {
            return;
          }
          if (
            path.node.value &&
            path.node.value.name === 'layout' &&
            path.node.key &&
            path.node.key.name === 'layout'
          ) {
            path.remove();
          }
        },
        //   Decorator(path, state) {
        //     if (!shouldContinue(state)) {
        //       return;
        //     }
        //     if (path.node.expression && path.node.expression.callee) {
        //       if (
        //         path.node.expression.callee.name === 'templateLayout' ||
        //         path.node.expression.callee.name === 'layout'
        //       ) {
        //         path.remove();
        //       } else {
        //         console.log(path.node.expression.callee.name);
        //       }
        //     }
        //   },
      },
    };
  }
  
}