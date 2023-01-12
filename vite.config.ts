import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import fs from 'node:fs';

const emberPackages = fs.readdirSync('node_modules/ember-source/dist/packages/@ember');

export default defineConfig({
    resolve: {
        alias: [
            { find: '@glimmer/tracking', replacement: './src/config/ember' },
            { find: 'ember', replacement: 'ember-source/dist/packages/ember' },
            { find: 'ember-component-manager', replacement: '@glimmer/component/addon/-private/ember-component-manager'},
            { find: '@glimmer/component', replacement: '@glimmer/component/addon/-private/component' },
            {
                find: '@glimmer/env',
                replacement: './glimmer-env/index.ts',
            },
            ...emberPackages.map((pkg) => ({

                find: `@ember/${pkg}`,
                replacement: `ember-source/dist/packages/@ember/${pkg}`
            }))
        ],
    },
    plugins: [
        babel({
            // regexp to match files in src folder
            filter: /^.*src\/.*\.(ts|js)$/,
            babelConfig: {
                babelrc: false,
                configFile: false,
                plugins: [
                    ['@babel/plugin-proposal-decorators', {
                         legacy: true
                    }],
                    ['@babel/plugin-proposal-class-properties', { loose: false }],
                    ['babel-plugin-ember-template-compilation/node', {
                        compilerPath: "ember-source/dist/ember-template-compiler.js",
                        targetFormat: 'wire',
                        outputModuleOverrides: {
                            '@ember/template-factory': {
                                createTemplateFactory: ['createTemplateFactory', 'ember-source/dist/packages/@ember/template-factory/index.js'],
                            }
                        }
                    
                    }]
                    
                ],
                "presets": ["@babel/preset-typescript"]
            }
        }),
        // ...
    ],

    // ...
})