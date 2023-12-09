import type { NodePath } from '@babel/traverse';
import type { Program, ImportDeclaration, CallExpression } from '@babel/types';
import type * as b from '@babel/types';

export function dropImportSync(addons: string[]) {
  return function dropImportSyncPlugin(babel: any) {
    const { types: t } = babel as { types: typeof b };
    let cnt = 0;
    type State = {
      file: {
        opts: {
          filename: string;
        };
      };
      importsToAppend?: ImportDeclaration[];
    };
    function keyValue() {
      return `_$key${cnt++}`;
    }
    const shouldContinue = (state: State) => {
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
          exit(path: NodePath<Program>, state: State) {
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
        ImportDeclaration(path: NodePath<ImportDeclaration>, state: State) {
          if (!shouldContinue(state)) {
            return;
          }
          if (path.node.source.value === '@embroider/macros') {
            path.node.specifiers = path.node.specifiers.filter((el) => {
              if (
                t.isImportDefaultSpecifier(el) ||
                t.isImportNamespaceSpecifier(el)
              ) {
                return true;
              }
              if (t.isStringLiteral(el.imported)) {
                return;
              }
              return el.imported && el.imported.name !== 'importSync';
            });
            if (path.node.specifiers.length === 0) {
              path.remove();
            }
          }
        },
        CallExpression(path: NodePath<CallExpression>, state: State) {
          if (!shouldContinue(state)) {
            return;
          }
          if (t.isV8IntrinsicIdentifier(path.node.callee)) {
            return;
          }
          if (
            path.node.callee &&
            t.isIdentifier(path.node.callee) &&
            path.node.callee.name === 'importSync' &&
            path.node.arguments[0] &&
            t.isStringLiteral(path.node.arguments[0])
          ) {
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
