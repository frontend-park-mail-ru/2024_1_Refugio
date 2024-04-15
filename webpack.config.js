import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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
            'postcss-loader',
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
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