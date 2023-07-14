import { preprocess, traverse, ASTv1, print, builders } from '@glimmer/syntax';
import type { types as babelTypes } from '@babel/core';
const ignoredComponents = ['LinkTo'];

const Seen = Symbol('seen');

type SeenElement = ASTv1.ElementNode & { [Seen]?: boolean };

const HotComponentName = 'Hot';
const HotComponentAttribute = '@component';
const PrecompileFunctionName = 'precompileTemplate';
const ScopePropertyName = 'scope';

function elementTransform(node: SeenElement, scopeKeys: string[]) {
  if (node.tag.toLowerCase() === node.tag) {
    return;
  }
  if (node[Seen]) {
    return;
  }
  const originalTag = node.tag;

  if (ignoredComponents.includes(originalTag)) {
    return;
  }
  node[Seen] = true;
  const newNode = builders.element(HotComponentName, {
    children: [node],
    attrs: [
      builders.attr(
        HotComponentAttribute,
        scopeKeys.includes(originalTag)
          ? builders.mustache(builders.path(originalTag))
          : builders.text(originalTag)
      ),
    ],
    blockParams: [originalTag],
  });
  (newNode as SeenElement)[Seen] = true;
  return newNode;
}

export function babelHotReloadPlugin(babel: { types: typeof babelTypes }) {
  // get file name
  const t = babel.types;
  const visitor = {
    Program: {
      enter(_: any, state: any) {
        const fileName = state.file.opts.filename || '';
        const isSrcFile = fileName.includes('/src/');
        const isNodeModules = fileName.includes('/node_modules/');
        const isTestFile = fileName.includes('/tests/');
        const isComponentFile = fileName.includes('/components/');

        state.shouldProcess =
          isSrcFile && !isNodeModules && !isTestFile && isComponentFile;
        state.moduleName = '';
        state.sourcesToHotReload = new Set();
      },
      exit(path: any, state: any) {
        if (!state.shouldProcess) {
          return;
        }

        const sources: string[] = Array.from(state.sourcesToHotReload);
        // console.log('sources', sources, fileName);
        // console.log('state.file.opts.filename', fileName);
        if (state.moduleName || sources.length > 0) {
          // check if we already have import getComponentTemplate from '@glimmer/manager';
          const hasImport = path.node.body.find((node: any) => {
            return (
              node.type === 'ImportDeclaration' &&
              node.source.value === '@glimmer/manager' &&
              node.specifiers.find(
                (specifier: any) =>
                  specifier.imported.name === 'getComponentTemplate'
              )
            );
          });

          // add import { getComponentTemplate } from '@glimmer/manager'; to the top
          !hasImport &&
            path.node.body.unshift(
              t.importDeclaration(
                [
                  t.importSpecifier(
                    t.identifier('getComponentTemplate'),
                    t.identifier('getComponentTemplate')
                  ),
                ],
                t.stringLiteral('@glimmer/manager')
              )
            );
        }
        /* 
        add this to the bottom of the file
        if (import.meta.hot) {
            import.meta.hot.accept((newModule) => {
                const tpl = getComponentTemplate(newModule.default);
                const moduleName = tpl().moduleName;
                window.dispatchEvent(
                new CustomEvent('hot-reload', {
                    detail: {
                    moduleName,
                    component: newModule.default,
                    },
                })
                );
            });
            import.meta.hot.accept('./template.hbs', (newFoo) => {
    const tpl = getComponentTemplate(newFoo.default);
    const moduleName = tpl().moduleName;
    class NewComponent extends Button {
      static template = tpl;
    }
    window.dispatchEvent(
      new CustomEvent('hot-reload', {
        detail: {
          moduleName,
          component: NewComponent,
        },
      })
    );
  });

        */
        if (state.moduleName) {
          //   if (isHBS) {
          //     console.log('isHBS', fileName, state.moduleName);
          //   }
          // check for import.meta.hot already exist

          const hasImportMetaHot = path.node.body.find((node: any) => {
            return (
              node.type === 'IfStatement' &&
              node.test.type === 'MemberExpression' &&
              node.test.object.type === 'MemberExpression' &&
              node.test.object.object.type === 'Identifier' &&
              node.test.object.object.name === 'import' &&
              node.test.object.property.type === 'Identifier' &&
              node.test.object.property.name === 'meta' &&
              node.test.property.type === 'Identifier' &&
              node.test.property.name === 'hot'
            );
          });
          !hasImportMetaHot &&
            path.node.body.push(
              t.ifStatement(
                t.memberExpression(
                  t.memberExpression(
                    t.identifier('import'),
                    t.identifier('meta')
                  ),
                  t.identifier('hot')
                ),
                t.blockStatement([
                  t.expressionStatement(
                    t.callExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.memberExpression(
                            t.identifier('import'),
                            t.identifier('meta')
                          ),
                          t.identifier('hot')
                        ),
                        t.identifier('accept')
                      ),
                      [
                        t.arrowFunctionExpression(
                          [t.identifier('newModule')],
                          t.blockStatement([
                            t.variableDeclaration('const', [
                              t.variableDeclarator(
                                t.identifier('tpl'),
                                t.callExpression(
                                  t.identifier('getComponentTemplate'),
                                  [
                                    t.memberExpression(
                                      t.identifier('newModule'),
                                      t.identifier('default')
                                    ),
                                  ]
                                )
                              ),
                            ]),
                            t.variableDeclaration('const', [
                              t.variableDeclarator(
                                t.identifier('moduleName'),
                                t.memberExpression(
                                  t.callExpression(t.identifier('tpl'), []),
                                  t.identifier('moduleName')
                                )
                              ),
                            ]),
                            t.expressionStatement(
                              t.callExpression(
                                t.memberExpression(
                                  t.identifier('window'),
                                  t.identifier('dispatchEvent')
                                ),
                                [
                                  t.newExpression(t.identifier('CustomEvent'), [
                                    t.stringLiteral('hot-reload'),
                                    t.objectExpression([
                                      t.objectProperty(
                                        t.identifier('detail'),
                                        t.objectExpression([
                                          t.objectProperty(
                                            t.identifier('moduleName'),
                                            t.identifier('moduleName')
                                          ),
                                          t.objectProperty(
                                            t.identifier('component'),
                                            t.memberExpression(
                                              t.identifier('newModule'),
                                              t.identifier('default')
                                            )
                                          ),
                                        ])
                                      ),
                                    ]),
                                  ]),
                                ]
                              )
                            ),
                          ])
                        ),
                      ]
                    )
                  ),
                  ...sources.map((source: string) => {
                    return t.expressionStatement(
                      t.callExpression(
                        t.memberExpression(
                          t.memberExpression(
                            t.memberExpression(
                              t.identifier('import'),
                              t.identifier('meta')
                            ),
                            t.identifier('hot')
                          ),
                          t.identifier('accept')
                        ),
                        [
                          t.stringLiteral(source),
                          t.arrowFunctionExpression(
                            [t.identifier('newModule')],
                            t.blockStatement([
                              t.variableDeclaration('const', [
                                t.variableDeclarator(
                                  t.identifier('tpl'),
                                  t.callExpression(
                                    t.identifier('getComponentTemplate'),
                                    [
                                      t.memberExpression(
                                        t.identifier('newModule'),
                                        t.identifier('default')
                                      ),
                                    ]
                                  )
                                ),
                              ]),
                              t.variableDeclaration('const', [
                                t.variableDeclarator(
                                  t.identifier('moduleName'),
                                  t.memberExpression(
                                    t.callExpression(t.identifier('tpl'), []),
                                    t.identifier('moduleName')
                                  )
                                ),
                              ]),
                              t.classDeclaration(
                                t.identifier('NewComponent'),
                                t.identifier(state.moduleName),
                                t.classBody([
                                  t.classProperty(
                                    t.identifier('template'),
                                    t.identifier('tpl'),
                                    undefined,
                                    undefined,
                                    false,
                                    true
                                  ),
                                ])
                              ),
                              t.expressionStatement(
                                t.callExpression(
                                  t.memberExpression(
                                    t.identifier('window'),
                                    t.identifier('dispatchEvent')
                                  ),
                                  [
                                    t.newExpression(
                                      t.identifier('CustomEvent'),
                                      [
                                        t.stringLiteral('hot-reload'),
                                        t.objectExpression([
                                          t.objectProperty(
                                            t.identifier('detail'),
                                            t.objectExpression([
                                              t.objectProperty(
                                                t.identifier('moduleName'),
                                                t.identifier('moduleName')
                                              ),
                                              t.objectProperty(
                                                t.identifier('component'),
                                                t.identifier('NewComponent')
                                              ),
                                            ])
                                          ),
                                        ]),
                                      ]
                                    ),
                                  ]
                                )
                              ),
                            ])
                          ),
                        ]
                      )
                    );
                  }),
                ])
              )
            );
        }

        // console.log(path.toString());
      },
    },
    ExportDefaultDeclaration(path: any, state: any) {
      if (!state.shouldProcess) {
        return;
      }
      if (t.isClassDeclaration(path.node.declaration)) {
        // get className and moduleName
        state.moduleName = path.node.declaration.id.name;
      }
    },
    ImportDeclaration(path: any, state: any) {
      if (!state.shouldProcess) {
        return;
      }
      // detect import ends with `.hbs`
      const source = path.node.source.value;
      const isRelative = source.startsWith('.');
      if (source.endsWith('.hbs') && isRelative) {
        state.sourcesToHotReload.add(path.node.source.value);
      }
    },
    CallExpression(path: any, state: any) {
      if (!state.shouldProcess) {
        return;
      }
      if (path.node.callee.name !== PrecompileFunctionName) {
        return;
      }

      let scopeKeys: string[] = [];

      if (path.node.arguments.length === 2) {
        if (t.isObjectExpression(path.node.arguments[1])) {
          const scope = path.node.arguments[1].properties.find(
            (prop) =>
              t.isObjectProperty(prop) &&
              t.isIdentifier(prop.key) &&
              prop.key.name === ScopePropertyName
          );
          if (t.isObjectProperty(scope)) {
            if (t.isArrowFunctionExpression(scope.value)) {
              if (t.isObjectExpression(scope.value.body)) {
                scopeKeys = scope.value.body.properties
                  .map(
                    (prop) =>
                      (t.isObjectProperty(prop) &&
                        t.isIdentifier(prop.key) &&
                        prop.key.name) ??
                      ''
                  )
                  .filter((e) => e && e.length) as string[];
              }
            }
          }
        }
      }

      const tpl = path.node.arguments[0].quasis[0].value.raw;
      const ast = preprocess(tpl);
      traverse(ast, {
        ElementNode(node: ASTv1.ElementNode) {
          return elementTransform(node, scopeKeys);
        },
      });
      // print the ast

      const newTpl = print(ast);

      path.node.arguments[0].quasis[0] = t.templateElement({
        raw: newTpl,
      });
    },
  };
  return { visitor };
}
