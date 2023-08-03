import { preprocess, traverse, ASTv1, print, builders } from '@glimmer/syntax';
import type { types as babelTypes } from '@babel/core';
const ignoredComponents = ['LinkTo'];

const Seen = Symbol('seen');

type SeenElement = ASTv1.ElementNode & { [Seen]?: boolean };

const HotComponentName = 'Hot';
const HotComponentAttribute = '@component';
const HotComponentPath = '@/components/Hot';
const PrecompileFunctionNames = [
  'precompileTemplate',
  'compileTemplate',
  'template',
];
const ScopePropertyName = 'scope';
const WindowHotReloadEventName = 'hot-reload';

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

function shouldProcess(fileName: string) {
  const isHotComponent = fileName.includes('/components/Hot');
  const isSrcFile = fileName.includes('/src/');
  const isNodeModules = fileName.includes('/node_modules/');
  const isTestFile = fileName.includes('/tests/');
  const isComponentFile = fileName.includes('/components/');
  const isTemplate = fileName.includes('/templates/');
  return (
    !isHotComponent &&
    isSrcFile &&
    !isNodeModules &&
    !isTestFile &&
    (isComponentFile || isTemplate)
  );
}

function hasImportDeclaration(node: babelTypes.Program) {
  return node.body.find((node) => {
    return (
      node.type === 'ImportDeclaration' &&
      node.source.value === '@glimmer/manager' &&
      node.specifiers.find(
        (specifier) =>
          'imported' in specifier &&
          'name' in specifier.imported &&
          specifier.imported.name === 'getComponentTemplate'
      )
    );
  });
}

function hasImportedHotComponent(node: babelTypes.Program) {
  return node.body.find((node) => {
    return (
      node.type === 'ImportDeclaration' &&
      node.source.value === HotComponentPath
    );
  });
}

function hasImportMetaHot(node: babelTypes.Program) {
  return node.body.find((node) => {
    return (
      node.type === 'IfStatement' &&
      node.test.type === 'MemberExpression' &&
      node.test.object.type === 'MetaProperty' &&
      node.test.object.property.type === 'Identifier' &&
      node.test.object.property.name === 'meta' &&
      node.test.property.type === 'Identifier' &&
      node.test.property.name === 'hot'
    );
  });
}

export function babelHotReloadPlugin(babel: { types: typeof babelTypes }): {
  visitor: Record<string, any>;
} {
  // get file name
  const t = babel.types;
  let cnt = 0;
  type State = {
    shouldProcess: boolean;
    file: { opts: { filename?: string } };
    moduleName: string;
    sourcesToHotReload: Set<string>;
  };
  interface Path<T> {
    node: T;
  }
  const visitor = {
    Program: {
      enter(_: Path<babelTypes.Program>, state: State) {
        const fileName = state.file.opts.filename || '';

        state.shouldProcess = shouldProcess(fileName);
        state.moduleName = '';
        state.sourcesToHotReload = new Set();
      },
      exit(path: Path<babelTypes.Program>, state: State) {
        if (!state.shouldProcess) {
          return;
        }

        const sources: string[] = Array.from(state.sourcesToHotReload);
        // console.log('sources', sources, fileName);
        // console.log('state.file.opts.filename', fileName);
        // check if we already have import getComponentTemplate from '@glimmer/manager';
        const hasImport = hasImportDeclaration(path.node);

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
        // console.log('state.moduleName', state.moduleName);
        const hasImportMetaHotReload = hasImportMetaHot(path.node);
        const hasImportedHot = hasImportedHotComponent(path.node);
        // console.log(hasImportMetaHotReload, state.file.opts.filename);

        /*
          generate ast builder code for:     const fallback = () => ({ moduleName: new URL(import.meta.url).pathname });
        */
        const fallbackVar = t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier('fallback'),
            t.arrowFunctionExpression(
              [],
              t.objectExpression([
                t.objectProperty(
                  t.identifier('moduleName'),
                  t.memberExpression(
                    t.newExpression(t.identifier('URL'), [
                      t.memberExpression(
                        t.memberExpression(
                          t.identifier('import'),
                          t.identifier('meta')
                        ),
                        t.identifier('url')
                      ),
                    ]),
                    t.identifier('pathname')
                  )
                ),
              ])
            )
          ),
        ]);

        !hasImportedHot &&
          path.node.body.push(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(HotComponentName))],
              t.stringLiteral(HotComponentPath)
            )
          );

        !hasImportMetaHotReload &&
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
                          fallbackVar,
                          t.variableDeclaration('const', [
                            t.variableDeclarator(
                              t.identifier('tpl'),
                              t.logicalExpression(
                                '||',
                                t.callExpression(
                                  t.identifier('getComponentTemplate'),
                                  [
                                    t.memberExpression(
                                      t.identifier('newModule'),
                                      t.identifier('default')
                                    ),
                                  ]
                                ),
                                t.identifier('fallback')
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
                                  t.stringLiteral(WindowHotReloadEventName),
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
                  cnt++;
                  const cmpName = state.moduleName + '_' + cnt;
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
                              t.identifier(cmpName),
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
                                  t.newExpression(t.identifier('CustomEvent'), [
                                    t.stringLiteral(WindowHotReloadEventName),
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
                                            t.identifier(cmpName)
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
                  );
                }),
              ])
            )
          );
      },
    },
    ExportDefaultDeclaration(
      path: Path<babelTypes.ExportDefaultDeclaration>,
      state: State
    ) {
      if (!state.shouldProcess) {
        return;
      }
      if (t.isClassDeclaration(path.node.declaration)) {
        // get className and moduleName
        state.moduleName = path.node.declaration.id.name;
      }
    },
    ImportDeclaration(path: Path<babelTypes.ImportDeclaration>, state: State) {
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
    CallExpression(path: Path<babelTypes.CallExpression>, state: State) {
      if (!state.shouldProcess) {
        return;
      }
      // if (state.file.opts.filename.endsWith('.gts')) {
      //   // console.log(path.toString());
      // }
      if (!t.isIdentifier(path.node.callee)) {
        // console.log('return', path.node.callee,  state.file.opts.filename);
        return;
      }
      if (!PrecompileFunctionNames.includes(path.node.callee.name)) {
        // console.log('return-2', path.node.callee.name, state.file.opts.filename);
        return;
      }

      // console.log('continue', path.node.callee.name, state.file.opts.filename);

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
                // add Hot to scope
                scope.value.body.properties.push(
                  t.objectProperty(
                    t.identifier(HotComponentName),
                    t.identifier(HotComponentName),
                    false,
                    true
                  )
                );
              }
            }
          }
        }
      }
      let tpl = '';
      const firstArg = path.node.arguments[0];
      const isTemplateLiteral = t.isTemplateLiteral(firstArg);
      const isStringLiteral = t.isStringLiteral(firstArg);
      if (isTemplateLiteral && firstArg.quasis.length) {
        const q = firstArg.quasis[0];
        if (q) {
          tpl = q.value.raw;
        }
      } else if (isStringLiteral) {
        tpl = firstArg.value;
      }
      const ast = preprocess(tpl);
      traverse(ast, {
        ElementNode(node: ASTv1.ElementNode) {
          return elementTransform(node, scopeKeys);
        },
      });
      // print the ast

      const newTpl = print(ast);

      if (isTemplateLiteral) {
        firstArg.quasis[0] = t.templateElement({
          raw: newTpl,
        });
      } else if (isStringLiteral) {
        firstArg.value = newTpl;
      }
    },
  };
  return { visitor };
}
