export default defineConfig({
    root: './public',
    publicDir: 'public',
    plugins: [
        handlebars(),
        {
            ...babel({ babelHelpers: 'bundled' }),
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
}); 