import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import { generateDefineConfig } from './compat/ember-data-private-build-infra/index.ts';
import {
  Addon,
  compatPath,
  nodePath,
  emberAppConfig,
  App,
} from './plugins/ember';
import { eDataPackages, internalPackages } from './plugins/ember-vendor';

const projectRoot = import.meta.url;

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  const enableSourceMaps = isDev;
  return emberAppConfig(
    {
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
              treeshake: 'safest',
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
          {
            find: `@/tests/`,
            replacement: fileURLToPath(new URL(`./tests/`, projectRoot)),
          },
          ...localScopes().map((scope) => ({
            find: `@/${scope}`,
            replacement: fileURLToPath(new URL(`./src/${scope}`, projectRoot)),
          })),
        ],
      },
      plugins: [],
    },
    [
      App(mode),

      ...internalPackages(mode),

      Addon('@ember-data', mode)
        .needBabel()
        .addAliases(
          eDataPackages().map((pkg) => ({
            find: `@ember-data/${pkg}`,
            replacement: nodePath(`@ember-data/${pkg}/addon`),
          }))
        )
        .addAlias(/^ember-data$/, 'ember-data/addon')
        .addAlias(
          /^@ember-data\/private-build-infra$/,
          compatPath('ember-data-private-build-infra')
        ),
      Addon('ember-notify', mode)
        .needAlias()
        .needBabel({ removeLegacyLayout: true }),
      Addon('ember-wormhole', mode).needBabel({ removeLegacyLayout: true }),
      Addon('ember-modal-dialog', mode)
        .needAlias()
        .needBabel({ removeLegacyLayout: true, dropImportSync: true }),
      Addon('ember-responsive', mode).needBabel({ removeLegacyLayout: true }),
      Addon('ember-bootstrap', mode).needAlias().needBabel(),
      Addon('ember-power-select', mode).needBabel(),
      Addon('ember-basic-dropdown', mode).needBabel(),
      Addon('ember-ref-bucket', mode).needAlias().needBabel(),
      Addon('ember-page-title', mode).needBabel(),
      Addon('tracked-toolbox', mode).needAlias().needBabel(),
      Addon('@ember-decorators/object', mode).needAlias(),
      Addon('@ember-decorators/component', mode).needAlias(),
      Addon('@ember-decorators/utils', mode).needAlias(),
      Addon('ember-concurrency', mode).needAlias(),
      Addon('ember-concurrency-decorators', mode).needAlias(),
      Addon('ember-inflector', mode).needAlias(),
      Addon('ember-modifier', mode).customModuleEntry('ember-modifier/dist'),
      Addon('ember-intl', mode).addAlias(
        'ember-intl/-private',
        nodePath('ember-intl/addon/-private')
      ),
      Addon('ember-simple-auth', mode)
        .addNestedAlias(
          'use-session-setup-method',
          './compat/ember-simple-auth/use-session-setup-method.ts'
        )
        .addAlias(
          /ember-simple-auth\/(?!(app|addon)\/)(.+)/,
          'ember-simple-auth/addon/$2'
        ),
    ]
  );
});

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
