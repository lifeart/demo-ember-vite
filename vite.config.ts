import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import fs from 'node:fs';

const emberPackages = fs.readdirSync('node_modules/ember-source/dist/packages/@ember');

console.log(emberPackages);

export default defineConfig({
    resolve: {
        alias: [
            { find: 'ember', replacement: 'ember-source/dist/packages/ember' },
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