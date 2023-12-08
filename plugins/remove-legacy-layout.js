export function removeLegacyLayout() {
  const shouldContinue = (state) => {
    const fName = state.file.opts.filename;
    return fName.includes('node_modules') && fName.includes('addon');
  };
  //   const { types: t } = babel;
  return {
    name: 'ast-transform', // not required
    visitor: {
      ImportDeclaration(path, state) {
        if (!shouldContinue(state)) {
          return;
        }
        if (path.node.source.value === '@ember-decorators/component') {
          path.remove();
        } else if (path.node.source.value.includes('/templates/')) {
          path.remove();
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
      Decorator(path, state) {
        if (!shouldContinue(state)) {
          return;
        }
        if (path.node.expression && path.node.expression.callee) {
          if (path.node.expression.callee.name === 'templateLayout') {
            path.remove();
          }
        }
      },
    },
  };
}
