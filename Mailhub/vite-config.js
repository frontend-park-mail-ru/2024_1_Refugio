import { defineConfig } from 'vite';
import {handlebars} from 'vite-plugin-handlebars';
import babel from '@rollup/plugin-babel';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    root: './public',
    publicDir: 'public',
    plugins: [
        handlebars(),
        {
            ...babel({
                babelHelpers: 'runtime',
                presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
                plugins: ['@babel/plugin-transform-runtime'],
            }),
            apply: 'build',
            enforce: 'pre',
        },
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
    css: {
        postcss: {
            plugins: [
                autoprefixer(),
            ],
        },
        preprocessorOptions: {
            scss: {
                // additionalData: @import "~/styles/whoita.scss",
            },
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'build'),
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]',
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
            },
        },
        emptyOutDir: true,
        minify: true,
        assetsDir: '.',
    },
    server: {
        port: 8081,
        host: "0.0.0.0",
        hmr: true,
    },
}); 