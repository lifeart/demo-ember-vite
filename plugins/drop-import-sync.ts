export function dropImportSync(addons: string[]) {
  return function dropImportSyncPlugin(babel) {
    const { types: t } = babel;
    let cnt = 0;
    function keyValue() {
      return `_$key${cnt++}`;
    }
    const shouldContinue = (state) => {
      const fName = state.file.opts.filename;
      return (
        fName.includes('node_modules') &&
        addons.some((el) => fName.includes(`/${el}/`))
      );
    };

    return {
      name: 'drop-import-sync', // not required
      visitor: {
        Program: {
          exit(path, state) {
            if (!shouldContinue(state)) {
              return;
            }
            if (state.importsToAppend) {
              state.importsToAppend.forEach((el) => {
                path.node.body.unshift(el);
              });
              path.node.body.push(
                t.functionDeclaration(
                  t.identifier('_$importSync'),
                  [t.identifier('_$a')],
                  t.blockStatement([t.returnStatement(t.identifier('_$a'))])
                )
              );
            }
          },
        },
        ImportDeclaration(path, state) {
          if (!shouldContinue(state)) {
            return;
          }
          if (path.node.source.value === '@embroider/macros') {
            path.node.specifiers = path.node.specifiers.filter((el) => {
              return el.imported.name !== 'importSync';
            });
            if (path.node.specifiers.length === 0) {
              path.remove();
            }
          }
        },
        CallExpression(path, state) {
          if (!shouldContinue(state)) {
            return;
          }
          if (path.node.callee && path.node.callee.name === 'importSync') {
            path.node.callee.name = '_$importSync';
            state.importsToAppend = state.importsToAppend || [];
            const literalName = keyValue();
            state.importsToAppend.push(
              t.importDeclaration(
                [t.importNamespaceSpecifier(t.identifier(literalName))],
                t.stringLiteral(path.node.arguments[0].value)
              )
            );
            path.node.arguments[0] = t.identifier(literalName);
          }
        },
      },
    };
  };
}
