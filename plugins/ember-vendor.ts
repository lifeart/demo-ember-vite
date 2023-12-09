import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Addon, compatPath, nodePath } from './ember';

const self = import.meta.url;

const modeModulesPath = path.resolve(
  path.dirname(fileURLToPath(self)),
  './../node_modules'
);

export function internalPackages(mode: string) {
  return [
    Addon('ember & ember-source & @ember/*', mode)
      .addAlias(/^ember$/, nodePath('ember-source/dist/packages/ember'))
      .addAlias(
        /^ember\/version$/,
        nodePath('ember-source/dist/packages/ember/version')
      )
      .addAliases(
        emberPackages().map((pkg) => ({
          find: `@ember/${pkg}`,
          replacement: nodePath(`ember-source/dist/packages/@ember/${pkg}`),
        }))
      ),

    Addon('@glimmer/*', mode)
      // .addAlias(
      //   '@glimmer/validator',
      //   nodePath('@glimmer/validator/dist/modules/es2017')
      // )
      .addAlias(
        '@glimmer/tracking/primitives/cache',
        nodePath(
          `ember-source/dist/packages/@glimmer/tracking/primitives/cache.js`
        )
      )
      .addAlias(
        /@glimmer\/tracking$/,
        nodePath(`ember-source/dist/packages/@glimmer/tracking`)
      )
      .addAlias(
        '@glimmer/component',
        nodePath('@glimmer/component/addon/-private/component')
      )
      .addAlias('@glimmer/env', compatPath('glimmer-env'))
      .addAliases(
        emberGlimmerDepsPackages().map((pkg) => ({
          find: `@glimmer/${pkg}`,
          replacement: nodePath(
            `ember-source/dist/dependencies/@glimmer/${pkg}`
          ),
        }))
      ),

    Addon('backburner', mode).addAlias(
      /^backburner$/,
      nodePath('backburner.js/dist/es6/backburner.js')
    ),

    Addon('ember-component-manager', mode).addSelfAlias(
      nodePath('@glimmer/component/addon/-private/ember-component-manager')
    ),

    Addon('@ember/test-helpers', mode).addSelfAlias(
      nodePath('@ember/test-helpers/addon-test-support/@ember/test-helpers')
    ),

    Addon('@ember/test-waiters', mode).addSelfAlias(
      nodePath('@ember/test-waiters/addon/@ember/test-waiters')
    ),

    Addon('ember-compatibility-helpers', mode).addSelfAlias(
      compatPath('ember-compatibility-helpers/index.ts')
    ),
    Addon('ember-cli-htmlbars', mode).addSelfAlias(
      compatPath('ember-cli-htmlbars/index.ts')
    ),
    Addon('ember-cli-test-loader', mode).addNestedAlias(
      'test-support/index',
      compatPath('ember-cli-test-loader/index.ts')
    ),
    Addon('ember-cli-version-checker', mode).addSelfAlias(
      compatPath('ember-cli-version-checker/index.ts')
    ),
    Addon('compat-ember-decorators', mode).addNestedAlias(
      'component',
      compatPath('ember-decorators/component.ts')
    ),
    Addon('require', mode).addSelfAlias(compatPath('require/index.ts')),
    Addon('ember-template-compiler', mode).addSelfAlias(
      nodePath('ember-source/dist/ember-template-compiler.js')
    ),
    Addon('ember-testing', mode)
      .addAlias(
        /^ember-testing$/,
        nodePath('ember-source/dist/packages/ember-testing')
      )
      .addAlias(
        /^ember-testing\//,
        nodePath('ember-source/dist/packages/ember-testing/')
      ),
    Addon('@embroider/macros', mode).addSelfAlias(
      compatPath('embroider-macros/index.ts')
    ),
    Addon('@embroider/util', mode).addSelfAlias(
      compatPath('embroider-util/index.ts')
    ),
    Addon('@ember/string', mode).needAlias(),
  ];
}

export function emberGlimmerDepsPackages() {
  return fs
    .readdirSync(
      path.join(
        modeModulesPath,
        'ember-source',
        'dist',
        'dependencies',
        '@glimmer'
      )
    )
    .filter((el) => !el.includes('env.') && !el.includes('manager.'))
    .map((el) => el.replace('.js', ''));
}

export function emberPackages() {
  return fs.readdirSync(
    path.join(modeModulesPath, 'ember-source', 'dist', 'packages', '@ember')
  );
}

export function eDataPackages() {
  const els = fs.readdirSync(path.join(modeModulesPath, '@ember-data'));
  return els.filter((e) => e !== 'private-build-infra');
}
