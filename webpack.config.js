import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import CopyPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _resolve = (...args) => path.resolve(__dirname, ...args);

export default (env) => {
  return {
    mode: env.mode ?? 'development',
    entry: _resolve('public', 'index.js'),
    output: {
      path: _resolve('build'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: '/', // This should be the root of your server
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: _resolve('public', 'index.html'),
        inject: 'body', // This line injects all your JavaScript files into the body of your HTML
      }),
      new webpack.ProgressPlugin(),
      // autoprefixer,
      // cssnano,
      new CopyPlugin({
        patterns: [
          { from: 'sw.js', to: 'sw.js' },
        ],
      }),

    ],
    module: {
      rules: [
        {
          test: /\.hbs$/,
          use: [
            {
              loader: 'handlebars-loader',
            },
          ],
        },

        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            // {
            //   loader: 'postcss-loader',
            //   options: {
            //     postcssOptions: {
            //       plugins: [
            //         [
            //           'autoprefixer',
            //         ],
            //         [
            //           'cssnano',
            //           {
            //             preset: 'default',
            //           },
            //         ],
            //       ],
            //     },
            //   },
            // },
          ]
        },
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: ['@babel/preset-env'],
        //     },
        //   },
        // },

      ]
    },
    resolve: {
      // ...
    },
    devServer: {
      port: env.port ?? 8081,
      open: true,
      static: {
        directory: _resolve('public'),
      },
    },
  };
};