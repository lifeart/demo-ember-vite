import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import hbsResolver from './plugins/hbs-resolver';
import i18nLoader from './plugins/i18n-loader';

const emberPackages = fs.readdirSync(
  'node_modules/ember-source/dist/packages/@ember'
);

const localScopes = [
  'config',
  'addons',
  'controllers',
  'components',
  'helpers',
  'services',
  'templates',
  'modifiers',
];

function addonExport(name: string) {
  return {
    find: name,
    replacement: fileURLToPath(
      new URL(
        `./node_modules/${name}/addon`,
        import.meta.url
      )
    ),
  }
}

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  return {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          nested: resolve(__dirname, 'tests/index.html'),
        },
      },
    },
    define: {
      ENV_DEBUG: isProd ? false : true,
      ENV_CI: false,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.hbs'],
      alias: [
        {
          find: 'ember-simple-auth/use-session-setup-method',
          replacement: './compat/ember-simple-auth/use-session-setup-method.ts',
        },
        {
          find: /ember-simple-auth\/(?!(app|addon)\/)(.+)/,
          replacement: 'ember-simple-auth/addon/$2',
        },
        { find: 'ember-intl/-private', replacement: fileURLToPath(new URL("./node_modules/ember-intl/addon/-private", import.meta.url)) },
        {
          find: 'ember-modifier',
          replacement: fileURLToPath(
            new URL('./node_modules/ember-modifier/dist', import.meta.url)
          ),
        },
        {
          find: '@glimmer/validator',
          replacement: fileURLToPath(
            new URL(
              './node_modules/@glimmer/validator/dist/modules/es2017',
              import.meta.url
            )
          ),
        },
        addonExport('ember-ref-bucket'),
        addonExport('@ember-decorators/object'),
        addonExport('@ember-decorators/component'),
        addonExport('@ember-decorators/utils'),
        addonExport('ember-concurrency'),
        addonExport('tracked-toolbox'),
        addonExport('ember-concurrency-decorators'),
        addonExport('ember-bootstrap'),
        {
          find: 'ember-testing',
          replacement: 'ember-source/dist/packages/ember-testing',
        },
        {
          find: 'ember-cli-version-checker',
          replacement: fileURLToPath(
            new URL(
              './compat/ember-cli-version-checker/index.ts',
              import.meta.url
            )
          ),
        },
        {
          find: 'require',
          replacement: fileURLToPath(
            new URL('./compat/require/index.ts', import.meta.url)
          ),
        },
        {
          find: 'ember-compatibility-helpers',
          replacement: fileURLToPath(
            new URL(
              './compat/ember-compatibility-helpers/index.ts',
              import.meta.url
            )
          ),
        },
        {
          find: 'ember-cli-htmlbars',
          replacement: fileURLToPath(
            new URL('./compat/ember-cli-htmlbars/index.ts', import.meta.url)
          ),
        },
        {
          find: 'ember-qunit-styles/container.css',
          replacement: fileURLToPath(
            new URL(
              './node_modules/ember-qunit/vendor/ember-qunit/test-container-styles.css',
              import.meta.url
            )
          ),
        },

        {
          find: 'ember-cli-test-loader/test-support/index',
          replacement: fileURLToPath(
            new URL('./compat/ember-cli-test-loader/index.ts', import.meta.url)
          ),
        },
        {
          find: '@ember/test-helpers',
          replacement:
            '@ember/test-helpers/addon-test-support/@ember/test-helpers',
        },
        {
          find: '@ember/test-waiters',
          replacement: '@ember/test-waiters/addon/@ember/test-waiters',
        },
        { find: 'ember-qunit', replacement: 'ember-qunit/addon-test-support' },
        {
          find: 'qunit-dom',
          replacement: 'qunit-dom/dist/addon-test-support/index.js',
        },
        {
          find: '@glimmer/tracking/primitives/cache',
          replacement: '@glimmer/validator/dist/modules/es2017/lib/tracking.js',
        },
        {
          find: /@glimmer\/tracking[^/]$/,
          replacement: fileURLToPath(
            new URL('./src/config/ember.ts', import.meta.url)
          ),
        },
        {
          find: '@embroider/macros',
          replacement: fileURLToPath(
            new URL('./compat/embroider-macros/index.ts', import.meta.url)
          ),
        },
        {
          find: '@embroider/util',
          replacement: fileURLToPath(
            new URL('./compat/embroider-util/index.ts', import.meta.url)
          ),
        },
        { find: 'ember', replacement: 'ember-source/dist/packages/ember' },
        {
          find: 'ember-component-manager',
          replacement:
            '@glimmer/component/addon/-private/ember-component-manager',
        },
        {
          find: '@glimmer/component',
          replacement: '@glimmer/component/addon/-private/component',
        },
        {
          find: '@glimmer/env',
          replacement: fileURLToPath(
            new URL('./compat/glimmer-env', import.meta.url)
          ),
        },
        {
          find: 'backburner',
          replacement: 'backburner.js/dist/es6/backburner.js',
        },
        ...localScopes.map((scope) => ({
          find: `@/${scope}`,
          replacement: fileURLToPath(
            new URL(`./src/${scope}`, import.meta.url)
          ),
        })),
        ...emberPackages.map((pkg) => ({
          find: `@ember/${pkg}`,
          replacement: fileURLToPath(
            new URL(
              `./node_modules/ember-source/dist/packages/@ember/${pkg}`,
              import.meta.url
            )
          ),
        })),
      ],
    },
    plugins: [
      hbsResolver(),
      i18nLoader(),
      !isDev
        ? babel({
            filter: /^.*@(ember|glimmer)\/.*\.(ts|js)$/,
            babelConfig: {
              babelrc: false,
              configFile: false,
              plugins: [
                [
                  'babel-plugin-unassert',
                  {
                    variables: [
                      'assert',
                      'info',
                      'warn',
                      'debug',
                      'deprecate',
                      'debugSeal',
                      'debugFreeze',
                      'runInDebug',
                    ],
                    modules: ['@ember/debug'],
                  },
                ],
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                ['@babel/plugin-proposal-class-properties', { loose: false }],
              ],
              presets: ['@babel/preset-typescript'],
            },
          })
        : null,
      // babel config for app code
      babel({
        // regexp to match files in src folder
        filter: /^.*src\/.*\.(ts|js|hbs)$/,
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              {
                legacy: true,
              },
            ],
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            [
              'babel-plugin-ember-template-compilation/node',
              {
                compilerPath: 'ember-source/dist/ember-template-compiler.js',
                targetFormat: 'wire',
                outputModuleOverrides: {
                  '@ember/template-factory': {
                    createTemplateFactory: [
                      'createTemplateFactory',
                      'ember-source/dist/packages/@ember/template-factory/index.js',
                    ],
                  },
                },
              },
            ],
          ],
          presets: ['@babel/preset-typescript'],
        },
      }),
      // ember-bootstrap [js]
      babel({
        // regexp to match files in src folder
        filter: /^.*ember-bootstrap\/.*\.(js)$/,
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              {
                legacy: true,
              },
            ],
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            [
              'babel-plugin-ember-template-compilation/node',
              {
                compilerPath: 'ember-source/dist/ember-template-compiler.js',
                targetFormat: 'wire',
                outputModuleOverrides: {
                  '@ember/template-factory': {
                    createTemplateFactory: [
                      'createTemplateFactory',
                      'ember-source/dist/packages/@ember/template-factory/index.js',
                    ],
                  },
                },
              },
            ],
          ],
        },
      }),
      // ember-bootstrap [hbs]
      babel({
        // regexp to match files in src folder
        filter: /^.*ember-bootstrap\/.*\.(hbs)$/,
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: [
            [
              'babel-plugin-ember-template-compilation/node',
              {
                compilerPath: 'ember-source/dist/ember-template-compiler.js',
                targetFormat: 'wire',
                outputModuleOverrides: {
                  '@ember/template-factory': {
                    createTemplateFactory: [
                      'createTemplateFactory',
                      'ember-source/dist/packages/@ember/template-factory/index.js',
                    ],
                  },
                },
              },
            ],
          ],
        },
      }),
      // babel config for addons ??
      babel({
        // regexp to match files in src folder
        filter:
          /^.*(ember-ref-bucket|tracked-toolbox|ember-power-select|ember-basic-dropdown|page-title)\/.*\.(ts|js|hbs)$/,
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              {
                legacy: true,
              },
            ],
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            [
              'babel-plugin-ember-template-compilation/node',
              {
                compilerPath: 'ember-source/dist/ember-template-compiler.js',
                targetFormat: 'wire',
                outputModuleOverrides: {
                  '@ember/template-factory': {
                    createTemplateFactory: [
                      'createTemplateFactory',
                      'ember-source/dist/packages/@ember/template-factory/index.js',
                    ],
                  },
                },
              },
            ],
          ],
          presets: ['@babel/preset-typescript'],
        },
      }),
      // ...
    ].filter((el) => el !== null),

    // ...
  };
});
