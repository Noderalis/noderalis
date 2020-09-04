import { Configuration, identity } from '@noderalis/core';
import TsLoader from 'ts-loader';
import Util from 'util';
import Webpack, {
	Configuration as WebpackConfigurationDefinition,
	ProgressPlugin,
} from 'webpack';
import { merge } from 'webpack-merge';

export class WebpackConfiguration {
	async createEntry(
		workspace: string
	): Promise<WebpackConfigurationDefinition> {
		console.log('Getting roots\n');

		const workspaceKebab = workspace.replace('@', '').replace('/', '-');

		const obj = identity<WebpackConfigurationDefinition>({
			entry: {
				[workspaceKebab]: await Configuration.workspace(workspace),
			},
			output: {
				libraryTarget: 'commonjs2',
				filename: '[name].js',
				path: await Configuration.resolveProjectWorkspace(workspace, 'lib'),
			},
		});

		console.log(Util.inspect(obj, { colors: true, depth: Infinity }));

		return obj;
	}

	async create(): Promise<WebpackConfigurationDefinition[]> {
		const baseConfig = identity<WebpackConfigurationDefinition>({
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						loader: 'ts-loader',
						options: identity<Partial<TsLoader.Options>>({
							// configFile: resolve(__dirname, '../../../..', 'tsconfig.json'),
							happyPackMode: true,
						}),
					},
				],
			},
			bail: true,
			externals: {
				webpack: 'webpack',
				typescript: 'typescript',
			},
			plugins: [
				new ProgressPlugin({
					entries: true,
					modules: true,
					activeModules: true,
				}),
			],
			mode: 'development',
			resolve: {
				extensions: ['.ts', '.tsx', '.js', '.json'],
			},
			target: 'async-node',
		});

		const configs = [
			merge(baseConfig, await this.createEntry('@noderalis/builder')),
			merge(baseConfig, await this.createEntry('@noderalis/cli')),
			merge(baseConfig, await this.createEntry('@noderalis/core')),
		];

		console.log(Util.inspect(configs, { colors: true, depth: Infinity }));

		return configs;
	}

	async run() {
		const compiler = Webpack(await this.create());

		compiler.run((err, stats) => {
			if (err) throw err;

			if (stats) {
				if (stats.hasErrors()) {
					stats.stats.forEach((entryStats) => {
						console.error(
							'Errors found: ' + Util.inspect(entryStats.compilation.errors)
						);
					});
				}
			}

			console.log('Compilation complete! No errors to report.');
		});
	}
}
