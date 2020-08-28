"use strict";
// import TsPlugin from 'fork-ts-checker-webpack-plugin';
// import path from 'path';
// import tsLoader from 'ts-loader';
// import webpack from 'webpack';
// import merge from 'webpack-merge';
// import { AbstractConfiguration } from './AbstractConfiguration';
// import { CommandContext } from './CommandContext';
// import { identity } from './env';
// import { cpus } from 'os';
// import rootDir from './rootDir';
// const PnpPlugin = require('pnp-webpack-plugin');
// export class WebpackConfiguration extends AbstractConfiguration {
//   static createWebpackConfig = (
//     context: CommandContext,
//     isProduction: boolean
//   ): webpack.Configuration => {
//     console.log(path.resolve(context.cwd, 'tsconfig.json'));
//     return merge(
//       {
//         // entry: async () => await ProjectConfiguration.workspace('@noderalis/cli'), // C:\Users\adria\Desktop\Grim\projects\noderalis\packages\noderalis-cli\sources\index.ts
//         entry: {
//           'noderalis-cli': rootDir(
//             'packages/noderalis-cli/sources',
//             'index.ts'
//           ),
//         }, // C:\Users\adria\Desktop\Grim\projects\noderalis\packages\noderalis-cli\sources\index.ts
//         // plugins: [new CleanWebpackPlugin()],
//         output: {
//           filename: '[name].js',
//           path: path.resolve(__dirname, 'dist'),
//         },
//       },
//       identity<webpack.Configuration>({
//         mode: isProduction ? 'production' : 'development',
//         devtool: 'source-map',
//         target: 'async-node',
//         bail: true,
//         node: {
//           __dirname: true,
//           __filename: true,
//         },
//         resolve: {
//           extensions: ['.ts', '.tsx', '.js'],
//           plugins: [PnpPlugin],
//         },
//         resolveLoader: {
//           plugins: [PnpPlugin.moduleLoader(module)],
//         },
//         profile: true,
//         module: {
//           rules: [
//             {
//               test: /\.tsx?$/,
//               exclude: [/\.jsx?$/, /\.node$/],
//               use: [
//                 {
//                   loader: require.resolve('thread-loader'), // Throw ts-loader into multi-threading to speed things up.
//                   options: {
//                     workers: cpus.length - 1,
//                     poolTimeout: Infinity,
//                   },
//                 },
//                 {
//                   loader: require.resolve('ts-loader'),
//                   options: identity<Partial<tsLoader.Options>>({
//                     compilerOptions: {
//                       declaration: true,
//                       module: 'ESNext' as any,
//                       moduleResolution: 'node' as any,
//                     },
//                     configFile: path.resolve(context.cwd, 'tsconfig.json'),
//                     transpileOnly: true,
//                     happyPackMode: true,
//                   }),
//                 },
//               ],
//             },
//             // {
//             //   enforce: 'pre',
//             //   test: /\.js$/,
//             //   loader: 'source-map-loader',
//             // },
//           ],
//         },
//         plugins: [
//           new webpack.ProgressPlugin(),
//           new TsPlugin({
//             async: true,
//             typescript: {
//               configFile: path.resolve(context.cwd, 'tsconfig.json'),
//               build: true,
//               mode: 'write-tsbuildinfo',
//             },
//           }),
//           {
//             apply: (compiler) => {
//               compiler.hooks.done.tap('Done', (_) => {
//                 if (isProduction)
//                   setTimeout(() => {
//                     context.stdout.write(
//                       'Compilation complete. Webpack is exiting safely.'
//                     );
//                     process.exit(0);
//                   });
//               });
//             },
//           },
//         ],
//       })
//     );
//   };
// }
