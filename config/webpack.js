const PnpPlugin = require('pnp-webpack-plugin');
const path = require('path');

module.exports = {
	entry: '.\\packages\\nodalis-builder\\lib\\tools\\buildRunner.js',
	module: {
		rules: [
			{
				test: /.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
	output: {
		filename: '[name].js',
		path: path.resolve('dist'),
	},
	resolve: {
		extensions: ['.ts', 'js'],
		plugins: [PnpPlugin],
	},
	resolveLoader: {
		plugins: [PnpPlugin.moduleLoader(module)],
	},
	target: 'async-node',
};
