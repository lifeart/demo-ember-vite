import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';
import { generateDefineConfig } from './compat/ember-data-private-build-infra/index';
import {
  Addon as AddonConstructor,
  compatPath,
  nodePath,
  emberAppConfig,
  App as AppConstructor,
} from './plugins/ember';
import { eDataPackages, internalPackages } from './plugins/ember-vendor';

const projectRoot = import.meta.url;

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  const enableSourceMaps = isDev;
  const Addon = (name: string) => {
    return AddonConstructor(name, mode);
  };
  const App = () => {
    return AppConstructor(mode);
  };
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
    },
    [
      App()
        .extendDefineConfig({
          ENV_DEBUG: isProd ? false : true,
          ENV_CI: false,
        })
        .addAlias(`@/tests/`, fileURLToPath(new URL(`./tests/`, projectRoot)))
        .addAliases(
          localScopes().map((scope) => ({
            find: `@/${scope}`,
            replacement: fileURLToPath(new URL(`./src/${scope}`, projectRoot)),
          }))
        ),

      ...internalPackages(mode),

      Addon('@ember-data')
        .needBabel()
        .extendDefineConfig(generateDefineConfig(isProd))
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
      Addon('ember-notify').needAlias().needBabel({ removeLegacyLayout: true }),
      Addon('ember-wormhole').needBabel({ removeLegacyLayout: true }),
      Addon('ember-modal-dialog')
        .needAlias()
        .needBabel({ removeLegacyLayout: true, dropImportSync: true }),
      Addon('ember-responsive').needBabel({ removeLegacyLayout: true }),
      Addon('ember-bootstrap').needAlias().needBabel(),
      Addon('ember-power-select').needBabel(),
      Addon('ember-basic-dropdown').needBabel(),
      Addon('ember-ref-bucket').needAlias().needBabel(),
      Addon('ember-page-title').needBabel(),
      Addon('tracked-toolbox').needAlias().needBabel(),
      Addon('@ember-decorators/object').needAlias(),
      Addon('@ember-decorators/component').needAlias(),
      Addon('@ember-decorators/utils').needAlias(),
      Addon('ember-concurrency').needAlias(),
      Addon('ember-concurrency-decorators').needAlias(),
      Addon('ember-inflector').needAlias(),
      Addon('ember-modifier').customModuleEntry('ember-modifier/dist'),
      Addon('ember-intl').addAlias(
        'ember-intl/-private',
        nodePath('ember-intl/addon/-private')
      ),
      Addon('ember-simple-auth')
        .addNestedAlias(
          'use-session-setup-method',
          compatPath('ember-simple-auth/use-session-setup-method.ts')
        )
        .addAlias(
          /ember-simple-auth\/(?!(app|addon)\/)(.+)/,
          nodePath('ember-simple-auth/addon/$2')
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
