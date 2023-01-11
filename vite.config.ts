import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
    plugins: [
        babel({
            // regexp to match js and ts files 
            filter: /\.(js|ts)?$/,
            babelConfig: {
                babelrc: false,
                configFile: false,
                plugins: [
                    ['@babel/plugin-proposal-decorators', {
                         legacy: true
                    }],
                    ['@babel/plugin-proposal-class-properties', { loose: false }]
                    
                ]
            }
        }),
        // ...
    ],

    // ...
})