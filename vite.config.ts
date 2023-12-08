import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import hbsResolver from './plugins/hbs-resolver';
import gtsResolver from './plugins/gts-resolver';
import i18nLoader from './plugins/i18n-loader';
import { generateDefineConfig } from './compat/ember-data-private-build-infra/index.ts';
import refBucketTransform from 'ember-ref-bucket/lib/ref-transform.js';
import { babelHotReloadPlugin } from './plugins/hot-reload';
import { removeLegacyLayout } from './plugins/remove-legacy-layout';
import { dropImportSync } from './plugins/drop-import-sync';
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  const enableSourceMaps = isDev;
  return {
    treeshake: {
      correctVarValueBeforeDeclaration: false,
      moduleSideEffects: false,
      preset: 'smallest',
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
    },
    build: {
      sourcemap: enableSourceMaps,
      rollupOptions: isDev
        ? {
            input: {
              main: resolve(__dirname, 'index.html'),
              nested: resolve(__dirname, 'tests/index.html'),
            },
          }
        : {
            output: {
              // manualChunks(id) {
              //   if (
              //     id.includes('/compat/') ||
              //     id.includes('@ember/') ||
              //     id.includes('/rsvp/') ||
              //     id.includes('/router_js/') ||
              //     id.includes('dag-map') ||
              //     id.includes('route-recognizer') ||
              //     id.includes('tracked-built-ins') ||
              //     id.includes('tracked-toolbox') ||
              //     id.includes('@ember-data/') ||
              //     id.includes('embroider-macros') ||
              //     id.includes('/backburner.js/') ||
              //     id.includes('@glimmer') ||
              //     id.includes('ember-inflector') ||
              //     id.includes('ember-source')
              //   ) {
              //     // chunk for ember runtime
              //     return 'core';
              //   }
              //   if (id.endsWith('/src/addons/index.ts')) {
              //     // initial addons and application chunk
              //     return 'app';
              //   }
              //   return undefined;
              // },
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
      ...generateDefineConfig(isProd),
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
        addonExport('ember-inflector'),
        addonExport('@ember/string'),
        addonExport('ember-notify'),
        addonExport('ember-modal-dialog'),
        {
          find: 'ember-simple-auth/use-session-setup-method',
          replacement: './compat/ember-simple-auth/use-session-setup-method.ts',
        },
        {
          find: 'ember-template-compiler',
          replacement:
            'node_modules/ember-source/dist/ember-template-compiler.js',
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
          find: 'compat-ember-decorators/component',
          replacement: compatPath('ember-decorators/component.ts'),
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
          find: '@ember/test-helpers',
          replacement:
            '@ember/test-helpers/addon-test-support/@ember/test-helpers',
        },
        {
          find: '@ember/test-waiters',
          replacement: '@ember/test-waiters/addon/@ember/test-waiters',
        },
        {
          find: '@glimmer/tracking/primitives/cache',
          replacement: nodePath(
            `ember-source/dist/packages/@glimmer/tracking/primitives/cache.js`
          ),
        },
        {
          find: /@glimmer\/tracking$/,
          replacement: nodePath(`ember-source/dist/packages/@glimmer/tracking`),
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
        ...emberGlimmerDepsPackages().map((pkg) => ({
          find: `@glimmer/${pkg}`,
          replacement: nodePath(
            `ember-source/dist/dependencies/@glimmer/${pkg}`
          ),
        })),
        ...eDataPackages().map((pkg) => ({
          find: `@ember-data/${pkg}`,
          replacement: nodePath(`@ember-data/${pkg}/addon`),
        })),
        {
          find: /^ember-data$/,
          replacement: 'ember-data/addon',
        },
        {
          find: /^@ember-data\/private-build-infra$/,
          replacement: compatPath('ember-data-private-build-infra'),
        },
      ].reduce((acc, el) => {
        const items = Array.isArray(el) ? el : [el];
        return [...acc, ...items];
      }, []),
    },
    plugins: [
      hbsResolver(isProd),
      gtsResolver(isProd),
      i18nLoader(),
      !isDev
        ? babel({
            filter: /^.*@(ember|glimmer|ember-data)\/.*\.(ts|js)$/,
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
                    version: 'legacy',
                  },
                ],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
              ],
              presets: ['@babel/preset-typescript'],
            },
          })
        : null,
      // babel config for app.js code
      babel({
        // regexp to match files in src folder
        filter: /^.*(src|tests)\/.*\.(ts|js|hbs|gts|gjs)$/,
        babelConfig: defaultBabelConfig(
          [isProd ? null : babelHotReloadPlugin].filter(
            (el) => el !== null
          ) as never[],
          isProd,
          enableSourceMaps
        ),
      }),
      // babel config for addons
      babel({
        // regexp to match files in src folder
        filter:
          /^.*(@ember-data|ember-notify|ember-wormhole|ember-modal-dialog|ember-bootstrap|ember-ref-bucket|tracked-toolbox|ember-power-select|ember-basic-dropdown|page-title)\/.*\.(ts|js|hbs)$/,
        babelConfig: addonBabelConfig(
          [
            dropImportSync(['ember-modal-dialog']),
            removeLegacyLayout([
              'ember-wormhole',
              'ember-modal-dialog',
              'ember-notify',
            ]),
          ],
          isProd
        ),
      }),
      // ...
    ].filter((el) => el !== null),

    // ...
  };
});

function emberGlimmerDepsPackages() {
  return fs
    .readdirSync('node_modules/ember-source/dist/dependencies/@glimmer')
    .filter((el) => !el.includes('env.') && !el.includes('manager.'))
    .map((el) => el.replace('.js', ''));
}

function emberPackages() {
  return fs.readdirSync('node_modules/ember-source/dist/packages/@ember');
}

function eDataPackages() {
  const els = fs.readdirSync('node_modules/@ember-data');
  return els.filter((e) => e !== 'private-build-infra');
}

function localScopes() {
  return [
    'addons',
    'authenticators',
    'models',
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
  return [
    {
      find: `${name}/app`,
      replacement: nodePath(`${name}/app`),
    },
    {
      find: `${name}/vendor`,
      replacement: nodePath(`${name}/vendor`),
    },
    {
      find: name,
      replacement: nodePath(`${name}/addon`),
    },
  ];
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
    // ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
    [
      '@babel/plugin-proposal-decorators',
      {
        version: 'legacy',
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-static-block',
      {
        loose: true,
      },
    ],
    templateCompilationPlugin(isProd),
  ];
}

function addonBabelConfig(
  plugins = [],
  isProd: boolean,
  enableSourceMaps = false
) {
  const config = defaultBabelConfig(plugins, isProd, enableSourceMaps);
  config.presets[0][1].onlyRemoveTypeImports = false;
  return config;
}

function defaultBabelConfig(
  plugins = [],
  isProd: boolean,
  enableSourceMaps = false
) {
  return {
    babelrc: false,
    configFile: false,
    sourceMaps: enableSourceMaps,
    plugins: [...plugins, ...defaultBabelPlugins(isProd)],
    presets: [
      [
        '@babel/preset-typescript',
        { allExtensions: true, onlyRemoveTypeImports: true },
      ],
    ],
  };
}
