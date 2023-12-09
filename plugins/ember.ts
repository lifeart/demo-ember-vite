import type { UserConfig } from 'vite';
import { removeLegacyLayout as removeLegacyLayoutPlugin } from './remove-legacy-layout';
import { dropImportSync as dropImportSyncPlugin } from './drop-import-sync';
import emberConcurrencyTransform from 'ember-concurrency/lib/babel-plugin-transform-ember-concurrency-async-tasks';
import refBucketTransform from 'ember-ref-bucket/lib/ref-transform';
import { fileURLToPath, URL } from 'node:url';
import babel from 'vite-plugin-babel';
import hbsResolver from './hbs-resolver';
import gtsResolver from './gts-resolver';
import i18nLoader from './i18n-loader';
import { babelHotReloadPlugin } from './hot-reload';

const selfPath = import.meta.url + '/../..';

export function App(mode: string) {
  const addon = new EmberAddon('app', mode);
  const isProd = addon.isProd;
  const isDev = addon.isDev;
  const enableSourceMaps = isDev;

  addon.resolveExtensions([
    '.mjs',
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
    '.hbs',
  ]);

  addon.babelPlugins = [
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
  ].filter((el) => el !== null);

  return addon;
}

export function emberAppConfig(
  definedConfig: UserConfig,
  addons: EmberAddon[]
) {
  addons.forEach((el) => el.attachToConfig(definedConfig));
  // console.table(definedConfig.resolve.alias);
  return definedConfig;
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

class EmberAddon {
  name!: string;
  aliases: { find: unknown; replacement: unknown }[] = [];
  babelPlugins: unknown[] = [];
  mode: string;
  defineConfig: Record<string, unknown> = {};
  extensions: string[] = [];
  constructor(name: string, mode: string) {
    this.name = name;
    this.mode = mode;
  }
  get isProd() {
    return this.mode === 'production';
  }
  get isDev() {
    return this.mode === 'development';
  }
  needAlias() {
    addonExport(this.name).forEach((el) => {
      this.aliases.push(el);
    });
    return this;
  }
  customModuleEntry(replacement: string, find: string = this.name) {
    this.aliases.push({
      find,
      replacement: nodePath(replacement),
    });
    return this;
  }
  resolveExtensions(extensions: string[]) {
    this.extensions = Array.from(new Set([...this.extensions, ...extensions]));
    return this;
  }
  extendDefineConfig(config: Record<string, unknown>) {
    this.defineConfig = { ...this.defineConfig, ...config };
    return this;
  }
  needBabel(
    {
      removeLegacyLayout,
      dropImportSync,
    }: { removeLegacyLayout?: boolean; dropImportSync?: boolean } = {
      removeLegacyLayout: false,
      dropImportSync: false,
    }
  ) {
    const addonFilterRegexp = new RegExp(`^.*(${this.name})/.*\\.(ts|js|hbs)$`);
    const extraPlugins = [];
    if (removeLegacyLayout) {
      extraPlugins.push(removeLegacyLayoutPlugin([this.name]));
    }
    if (dropImportSync) {
      extraPlugins.push(dropImportSyncPlugin([this.name]));
    }
    const plugin = babel({
      // regexp to match files in src folder
      filter: addonFilterRegexp,
      babelConfig: addonBabelConfig(extraPlugins, this.isProd, this.isDev),
    });
    this.babelPlugins.push(plugin);
    return this;
  }
  addAliases(aliases: { find: unknown; replacement: unknown }[] = []) {
    aliases.forEach((el) => {
      this.aliases.push(el);
    });
    return this;
  }
  addNestedAlias(find: unknown, replacement: unknown) {
    this.aliases.push({
      find: `${this.name}/${find}`,
      replacement,
    });
    return this;
  }
  addSelfAlias(replacement: unknown) {
    this.aliases.push({
      find: this.name,
      replacement,
    });
    return this;
  }
  addAlias(find: unknown, replacement: unknown) {
    this.aliases.push({
      find,
      replacement,
    });
    return this;
  }
  fixConfig(config: UserConfig) {
    const resolveExtensions = config?.resolve?.extensions ?? [];
    const resolveAlias = config?.resolve?.alias ?? [];
    const plugins = config?.plugins ?? [];
    const define = config?.define ?? {};
    if (!config.resolve) {
      config.resolve = {
        extensions: [],
        alias: [],
      };
    }
    config.resolve.extensions = resolveExtensions;
    config.resolve.alias = resolveAlias;
    config.plugins = plugins;
    config.define = define;

    return config as UserConfig & {
      resolve: {
        extensions: string[];
        alias: { find: unknown; replacement: unknown }[];
      };
      plugins: unknown[];
      define: Record<string, unknown>;
    };
  }
  attachToConfig(rawConfig: UserConfig) {
    const config = this.fixConfig(rawConfig);
    this.extensions.forEach((el) => {
      if (!config.resolve.extensions.includes(el)) {
        config.resolve.extensions.push(el);
      }
    });
    this.aliases.forEach((el) => {
      const existingAlias = config.resolve.alias.find((alias) => alias.find === el.find);
      if (!existingAlias) {
        config.resolve.alias.push(el);
      } else {
        throw new Error(
          `Alias ${el.find} already exists, but imported by [${this.name}] addon. Please check your config.
            Existing alias: ${existingAlias.replacement}
            New alias: ${el.replacement}
          `
        );
      }
    });
    this.babelPlugins.forEach((el) => {
      config.plugins.push(el);
    });
    Object.keys(this.defineConfig).forEach((el) => {
      if (config.define) {
        config.define[el] = this.defineConfig[el];
      }
    });
    return this;
  }
}

export function Addon(name: string, mode: string) {
  return new EmberAddon(name, mode);
}

export function defaultBabelConfig(
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
    emberConcurrencyTransform,
  ];
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

export function nodePath(name: string) {
  return fileURLToPath(new URL(`./node_modules/${name}`, selfPath));
}
export function compatPath(name: string) {
  return fileURLToPath(new URL(`./compat/${name}`, selfPath));
}
