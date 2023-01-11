import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
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