import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import hbsResolver from './plugins/hbs-resolver';
import gtsResolver from './plugins/gts-resolver';
import i18nLoader from './plugins/i18n-loader';

import refBucketTransform from 'ember-ref-bucket/lib/ref-transform.js';
import transformImports from 'ember-template-imports/src/babel-plugin';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  return {
    build: {
      rollupOptions: isDev
        ? {
            input: {
              main: resolve(__dirname, 'index.html'),
              nested: resolve(__dirname, 'tests/index.html'),
            },
          }
        : {
            output: {
              manualChunks(id) {
                if (
                  id.includes('/compat/') ||
                  id.includes('@ember') ||
                  id.includes('/rsvp/') ||
                  id.includes('/router_js/') ||
                  id.includes('dag-map') ||
                  id.includes('route-recognizer') ||
                  id.includes('/backburner.js/') ||
                  id.includes('@glimmer') ||
                  id.includes('ember-source')
                ) {
                  // chunk for ember runtime
                  return 'core';
                }
                if (id.endsWith('/src/addons/index.ts')) {
                  // initial addons and application chunk
                  return 'app';
                }
                return undefined;
              },
            },
          },
    },
    server: {
      port: 4200,
    },
    preview: {
      port: 4200,
    },
    define: {
      ENV_DEBUG: isProd ? false : true,
      ENV_CI: false,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.hbs'],
      alias: [
        addonExport('ember-ref-bucket'),
        addonExport('@ember-decorators/object'),
        addonExport('@ember-decorators/component'),
        addonExport('@ember-decorators/utils'),
        addonExport('ember-concurrency'),
        addonExport('tracked-toolbox'),
        addonExport('ember-concurrency-decorators'),
        addonExport('ember-bootstrap'),
        {
          find: 'ember-simple-auth/use-session-setup-method',
          replacement: './compat/ember-simple-auth/use-session-setup-method.ts',
        },
        {
          find: /ember-simple-auth\/(?!(app|addon)\/)(.+)/,
          replacement: 'ember-simple-auth/addon/$2',
        },
        {
          find: 'ember-intl/-private',
          replacement: nodePath('ember-intl/addon/-private'),
        },
        {
          find: 'ember-modifier',
          replacement: nodePath('ember-modifier/dist'),
        },
        {
          find: '@glimmer/validator',
          replacement: nodePath('@glimmer/validator/dist/modules/es2017'),
        },

        {
          find: /^ember-testing$/,
          replacement: 'ember-source/dist/packages/ember-testing',
        },
        {
          find: /^ember-testing\//,
          replacement: 'ember-source/dist/packages/ember-testing/',
        },
        {
          find: 'ember-cli-version-checker',
          replacement: compatPath('ember-cli-version-checker/index.ts'),
        },
        {
          find: 'require',
          replacement: compatPath('require/index.ts'),
        },
        {
          find: 'ember-compatibility-helpers',
          replacement: compatPath('ember-compatibility-helpers/index.ts'),
        },
        {
          find: 'ember-cli-htmlbars',
          replacement: compatPath('ember-cli-htmlbars/index.ts'),
        },
        {
          find: 'ember-cli-test-loader/test-support/index',
          replacement: compatPath('ember-cli-test-loader/index.ts'),
        },
        {
          find: 'ember-qunit-styles/container.css',
          replacement: nodePath(
            'ember-qunit/vendor/ember-qunit/test-container-styles.css'
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
          replacement: compatPath('embroider-macros/index.ts'),
        },
        {
          find: '@embroider/util',
          replacement: compatPath('embroider-util/index.ts'),
        },
        { find: /^ember$/, replacement: 'ember-source/dist/packages/ember' },
        {
          find: /^ember\/version$/,
          replacement: 'ember-source/dist/packages/ember/version',
        },
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
          replacement: compatPath('glimmer-env'),
        },
        {
          find: /^backburner$/,
          replacement: nodePath('backburner.js/dist/es6/backburner.js'),
        },
        {
          find: `@/tests/`,
          replacement: fileURLToPath(new URL(`./tests/`, import.meta.url)),
        },
        ...localScopes().map((scope) => ({
          find: `@/${scope}`,
          replacement: fileURLToPath(
            new URL(`./src/${scope}`, import.meta.url)
          ),
        })),
        ...emberPackages().map((pkg) => ({
          find: `@ember/${pkg}`,
          replacement: nodePath(`ember-source/dist/packages/@ember/${pkg}`),
        })),
      ],
    },
    plugins: [
      hbsResolver(isProd),
      gtsResolver(),
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
        filter: /^.*(src|tests)\/.*\.(ts|js|hbs|gts|gjs)$/,
        babelConfig: defaultBabelConfig([transformImports], isProd),
      }),
      // babel config for addons
      babel({
        // regexp to match files in src folder
        filter:
          /^.*(ember-bootstrap|ember-ref-bucket|tracked-toolbox|ember-power-select|ember-basic-dropdown|page-title)\/.*\.(ts|js|hbs)$/,
        babelConfig: defaultBabelConfig([], isProd),
      }),
      // ...
    ].filter((el) => el !== null),

    // ...
  };
});

function emberPackages() {
  return fs.readdirSync('node_modules/ember-source/dist/packages/@ember');
}

function localScopes() {
  return [
    'addons',
    'authenticators',
    'components',
    'config',
    'controllers',
    'helpers',
    'initializers',
    'instance-initializers',
    'modifiers',
    'routes',
    'services',
    'templates',
    'utils',
  ];
}

function addonExport(name: string) {
  return {
    find: name,
    replacement: nodePath(`${name}/addon`),
  };
}

function nodePath(name: string) {
  return fileURLToPath(new URL(`./node_modules/${name}`, import.meta.url));
}
function compatPath(name: string) {
  return fileURLToPath(new URL(`./compat/${name}`, import.meta.url));
}

function templateCompilationPlugin(isProd: boolean) {
  return [
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
      transforms: [
        refBucketTransform,
        isProd
          ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
            function sampleTransform(env) {
              return {
                name: 'skip-prod-test-selectors',
                visitor: {
                  ElementNode(node) {
                    node.attributes = node.attributes.filter(
                      (el) => !el.name.startsWith('data-test-')
                    );
                  },
                },
              };
            }
          : null,
      ].filter((el) => el !== null),
    },
  ];
}

function defaultBabelPlugins(isProd: boolean) {
  return [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    templateCompilationPlugin(isProd),
  ];
}

function defaultBabelConfig(plugins = [], isProd: boolean) {
  return {
    babelrc: false,
    configFile: false,
    plugins: [...plugins, ...defaultBabelPlugins(isProd)],
    presets: ['@babel/preset-typescript'],
  };
}
