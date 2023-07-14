import { preprocess, traverse, ASTv1, print, builders } from '@glimmer/syntax';
import type { types as babelTypes } from '@babel/core';
const ignoredComponents = ['LinkTo'];

const Seen = Symbol('seen');

type SeenElement = ASTv1.ElementNode & { [Seen]?: boolean };

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
  const newNode = builders.element('Hot', {
    children: [node],
    attrs: [
      builders.attr(
        '@component',
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
  const t = babel.types;
  const visitor = {
    CallExpression(path: any) {
      if (path.node.callee.name !== 'precompileTemplate') {
        return;
      }

      let scopeKeys: string[] = [];

      if (path.node.arguments.length === 2) {
        if (t.isObjectExpression(path.node.arguments[1])) {
          const scope = path.node.arguments[1].properties.find(
            (prop) => prop.key.name === 'scope'
          );
          if (t.isObjectProperty(scope)) {
            if (t.isArrowFunctionExpression(scope.value)) {
              if (t.isObjectExpression(scope.value.body)) {
                scopeKeys = scope.value.body.properties.map(
                  (prop) => prop.key.name
                );
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
