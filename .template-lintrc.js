'use strict';

export default {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': { allow: ['memory-usage'] },
    'no-implicit-this': { allow: ['memory-usage'] },
  },
  overrides: [
    {
      files: ['./src/**/*.gts'],
      rules: {
        'no-curly-component-invocation': 'off',
        'no-implicit-this': 'off',
      },
    },
  ],
};
