import { Configuration } from 'webpack';
import { env } from '@noderalis/core/sources';
import { paths } from '@noderalis/core/sources';
import { cpus } from 'os';
import PnpPlugin = require('pnp-webpack-plugin');
import TsPlugin from 'fork-ts-checker-webpack-plugin';
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';

/**
 * The base configuration which handles TypeScript and performance optimizations.
 *
 * @todo Make sure to add `webpack-dev-server` support and others.
 */
const base: Configuration = {
  // @ts-ignore
  devServer: {
    port: 3000,
  },
  devtool: 'source-map',
  mode: env.isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              workers: cpus.length - 1,
              poolTimeout: Infinity,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: paths.config.tsconfig,
              transpileOnly: true,
              happyPackMode: true,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  node: {
    __dirname: true,
    __filename: true,
  },
  output: {
    filename: '[name].js',
    path: paths.build.root,
  },
  plugins: [
    new CleanPlugin({
      verbose: env.isDevelopment,
    }),
    new TsPlugin({
      async: env.isDevelopment,
      typescript: {
        build: true,
        configFile: paths.config.tsconfig,
        mode: 'write-tsbuildinfo',
        profile: env.isDevelopment,
      },
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [PnpPlugin],
  },
  resolveLoader: {
    plugins: [PnpPlugin.moduleLoader(module)],
  },
  target: 'async-node',
  stats: {
    warnings: false,
  },
  watch: env.isDevelopment,
};

export default base;
