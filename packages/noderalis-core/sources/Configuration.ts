import camelcase from 'camelcase';
import { UsageError } from 'clipanion';
import { existsSync, readFileSync } from 'fs';
import { dirname, isAbsolute, join, normalize, resolve } from 'path';
import { prettifySyncErrors, replaceEnvVariables } from './miscUtils';
import { builtinModules, dynamicRequire } from './nodeUtils';
import { NoderalisPlugin } from './NoderalisPlugin';
import { parseYml } from './yml';

const IGNORED_ENV_VARIABLES = new Set([
	// "version" is set by Docker:
	// https://github.com/nodejs/docker-node/blob/5a6a5e91999358c5b04fddd6c22a9a4eb0bf3fbf/10/alpine/Dockerfile#L51
	`version`,
	// "flags" is set by Netlify
	`flags`,
]);

const ENVIRONMENT_PREFIX = `noderalis_`;

enum SettingsType {
	ANY = `ANY`,
	BOOLEAN = `BOOLEAN`,
	ABSOLUTE_PATH = `ABSOLUTE_PATH`,
	LOCATOR = `LOCATOR`,
	LOCATOR_LOOSE = `LOCATOR_LOOSE`,
	NUMBER = `NUMBER`,
	STRING = `STRING`,
	SECRET = `SECRET`,
	SHAPE = `SHAPE`,
	MAP = `MAP`,
}

type BaseSettings<T extends SettingsType = SettingsType> = {
	description: string;
	type: T;
	isArray?: boolean;
};

type ShapeSettings = BaseSettings<SettingsType.SHAPE> & {
	properties: {
		[propertyName: string]: Settings;
	};
};

type MapSettings = BaseSettings<SettingsType.MAP> & {
	valueDefinition: SettingsNoDefault;
	normalizeKeys?: (key: string) => string;
};

type SimpleSettings = BaseSettings<
	Exclude<SettingsType, SettingsType.SHAPE | SettingsType.MAP>
> & {
	default: any;
	defaultText?: string;
	isNullable?: boolean;
	values?: Array<any>;
};

type SettingsNoDefault =
	| MapSettings
	| ShapeSettings
	| Omit<SimpleSettings, 'default'>;

export type Settings = MapSettings | ShapeSettings | SimpleSettings;

export type NoderalisPluginConfiguration = {
	modules: Map<string, any>;
	plugins: Set<string>;
};

function getDefaultValue(configuration: Configuration, definition: Settings) {
	switch (definition.type) {
		case SettingsType.SHAPE: {
			const result = new Map<string, any>();

			for (const [propKey, propDefinition] of Object.entries(
				definition.properties
			)) {
				result.set(propKey, getDefaultValue(configuration, propDefinition));
			}

			return result;
		}

		case SettingsType.MAP: {
			return new Map<string, any>();
		}

		case SettingsType.ABSOLUTE_PATH: {
			if (definition.default === null) return null;
			if (typeof definition.default === 'string')
				if (configuration.projectCwd === null) {
					if (isAbsolute(definition.default))
						return normalize(definition.default);
					else if (definition.isNullable) return null;
					else return undefined;
				} else {
					if (Array.isArray(definition.default))
						return definition.default.map((entry: string) =>
							resolve(configuration.projectCwd!, entry)
						);
					else return resolve(configuration.projectCwd, definition.default);
				}
		}

		default: {
			return definition.default;
		}
	}
}

const coreDefinitions: { [coreSettingName: string]: Settings } = {
	verbose: {
		description: 'How much information is piped to stdout.',
		type: SettingsType.BOOLEAN,
		default: 1,
	},
	hello: {
		description: 'A simple hello string',
		type: SettingsType.STRING,
		default: null,
	},
};

function parseValue(
	configuration: Configuration,
	path: string,
	value: unknown,
	definition: Settings,
	folder: string
) {
	if (definition.isArray) {
		if (!Array.isArray(value)) {
			return String(value)
				.split(/,/)
				.map((segment) => {
					return parseSingleValue(
						configuration,
						path,
						segment,
						definition,
						folder
					);
				});
		} else {
			return value.map((sub, i) =>
				parseSingleValue(
					configuration,
					`${path}[${i}]`,
					sub,
					definition,
					folder
				)
			);
		}
	} else {
		if (Array.isArray(value)) {
			throw new Error(
				`Non-array configuration settings "${path}" cannot be an array`
			);
		} else {
			return parseSingleValue(configuration, path, value, definition, folder);
		}
	}
}

function parseBoolean(value: unknown) {
	switch (value) {
		case `true`:
		case `1`:
		case 1:
		case true: {
			return true;
		}
		case `false`:
		case `0`:
		case 0:
		case false: {
			return false;
		}
		default: {
			throw new Error(`Couldn't parse "${value}" as a boolean`);
		}
	}
}

function parseSingleValue(
	configuration: Configuration,
	path: string,
	value: unknown,
	definition: Settings,
	folder: string
) {
	switch (definition.type) {
		case SettingsType.ANY:
			return value;
		case SettingsType.SHAPE:
			return parseShape(configuration, path, value, definition, folder);
		case SettingsType.MAP:
			return parseMap(configuration, path, value, definition, folder);
	}

	if (value === null && !definition.isNullable && definition.default !== null)
		throw new Error(
			`Non-nullable configuration settings "${path}" cannot be set to null`
		);

	if (definition.values?.includes(value)) return value;

	const interpretValue = () => {
		if (definition.type === SettingsType.BOOLEAN) return parseBoolean(value);

		if (typeof value !== `string`)
			throw new Error(`Expected value (${value}) to be a string`);

		const valueWithReplacedVariables = replaceEnvVariables(value, {
			env: process.env,
		});

		switch (definition.type) {
			case SettingsType.ABSOLUTE_PATH:
				return resolve(folder, valueWithReplacedVariables);
			case SettingsType.NUMBER:
				return parseInt(valueWithReplacedVariables);
			default:
				return valueWithReplacedVariables;
		}
	};

	const interpreted = interpretValue();

	if (definition.values && !definition.values.includes(interpreted))
		throw new Error(
			`Invalid value, expected one of ${definition.values.join(`, `)}`
		);

	return interpreted;
}

function parseShape(
	configuration: Configuration,
	path: string,
	value: unknown,
	definition: ShapeSettings,
	folder: string
) {
	if (typeof value !== `object` || Array.isArray(value))
		throw new UsageError(
			`Object configuration settings "${path}" must be an object`
		);

	const result: Map<string, any> = getDefaultValue(configuration, definition);

	if (value === null) return result;

	for (const [propKey, propValue] of Object.entries(value)) {
		const subPath = `${path}.${propKey}`;
		const subDefinition = definition.properties[propKey];

		if (!subDefinition)
			throw new UsageError(
				`Unrecognized configuration settings found: ${path}.${propKey} - run "yarn config -v" to see the list of settings supported in Yarn`
			);

		result.set(
			propKey,
			parseValue(
				configuration,
				subPath,
				propValue,
				definition.properties[propKey],
				folder
			)
		);
	}

	return result;
}

function parseMap(
	configuration: Configuration,
	path: string,
	value: unknown,
	definition: MapSettings,
	folder: string
) {
	const result = new Map<string, any>();

	if (typeof value !== `object` || Array.isArray(value))
		throw new UsageError(
			`Map configuration settings "${path}" must be an object`
		);

	if (value === null) return result;

	for (const [propKey, propValue] of Object.entries(value)) {
		const normalizedKey = definition.normalizeKeys
			? definition.normalizeKeys(propKey)
			: propKey;
		const subPath = `${path}['${normalizedKey}']`;

		// @ts-expect-error: SettingsDefinitionNoDefault has ... no default ... but
		// that's fine because we're guaranteed it's not undefined.
		const valueDefinition: SettingsDefinition = definition.valueDefinition;

		result.set(
			normalizedKey,
			parseValue(configuration, subPath, propValue, valueDefinition, folder)
		);
	}

	return result;
}

function getEnvironmentSettings() {
	const environmentSettings: { [key: string]: any } = {};

	for (let [key, value] of Object.entries(process.env)) {
		key = key.toLowerCase();

		if (!key.startsWith(ENVIRONMENT_PREFIX)) continue;

		key = camelcase(key.slice(ENVIRONMENT_PREFIX.length));

		environmentSettings[key] = value;
	}

	return environmentSettings;
}

export enum ProjectLookup {
	NODERALIS,
	NONE,
}

export class Configuration {
	static resolveProjectWorkspace(workspace: string, arg1: string): string {
		return '';
	}

	static workspace(workspace: string): string {
		return '';
	}

	private static async findNoderalisFiles(startingCwd: string) {
		let noderalisFiles: { path: string; cwd: string; data: any }[] = [];

		let nextCwd = startingCwd;
		let currentCwd = null;

		while (nextCwd !== currentCwd) {
			currentCwd = nextCwd;

			const noderalisPath = join(currentCwd, '.noderalis.yml');

			if (existsSync(noderalisPath)) {
				const content = await readFileSync(noderalisPath, 'utf8');
				let data;

				try {
					data = parseYml(content) as any;
				} catch (error) {
					throw new UsageError(
						`Parse error when loading ${noderalisPath}. Please check that it's proper Yaml!`
					);
				}

				noderalisFiles.push({
					path: noderalisPath,
					cwd: currentCwd,
					data: data,
				});
			}

			nextCwd = dirname(currentCwd);
		}

		return noderalisFiles;
	}

	/**
	 * Returns the current working directory of the project.
	 * @param startingCwd
	 * @param noderalisFile
	 */
	private static async findProjectCwd(
		startingCwd: string,
		noderalisFile: string | null
	) {
		let projectCwd = null;
		let nextCwd = startingCwd;
		let currentCwd = null;

		while (nextCwd !== currentCwd) {
			currentCwd = nextCwd;

			if (existsSync(join(currentCwd, `package.json`))) projectCwd = currentCwd;

			if (noderalisFile !== null) {
				if (existsSync(join(currentCwd, noderalisFile))) {
					projectCwd = currentCwd;
					break;
				}
			} else {
				if (projectCwd !== null) projectCwd = null;
			}
			nextCwd = dirname(currentCwd);
		}

		return projectCwd;
	}
	/**
	 * Instantiate a new configuration object exposing the configuration obtained
	 * from `.noderalis.yml`
	 */
	public static async find(
		startingCwd: string,
		pluginConfiguration: NoderalisPluginConfiguration | null,
		{ lookup = ProjectLookup.NODERALIS, strict = true } = {}
	) {
		console.log(strict);

		const environmentSettings = getEnvironmentSettings();
		type CoreKeys = keyof typeof coreDefinitions;
		type CoreFields = { [key in CoreKeys]: Settings };

		const pickCoreFields = ({ verbose }: CoreFields) => ({ verbose });
		const excludeCoreFields = ({ verbose, ...rest }: CoreFields) => rest;

		const noderalisFiles = await Configuration.findNoderalisFiles(startingCwd);
		const configuration = new Configuration(startingCwd);
		configuration.importSettings(pickCoreFields(coreDefinitions));
		// eventually we'll support environment variables such as NODERALIS_APOLLO_KEY
		// configuration.useWithSource(`<environment>`, ...)
		for (const { path, cwd, data } of noderalisFiles)
			configuration.useWithSource(path, pickCoreFields(data), cwd);

		let projectCwd: string | null;

		switch (lookup) {
			case ProjectLookup.NODERALIS:
				{
					projectCwd = await Configuration.findProjectCwd(
						startingCwd,
						`.noderalis.yml`
					);
				}
				break;

			case ProjectLookup.NONE:
				{
					if (existsSync(join(startingCwd, `package.json`))) {
						projectCwd = resolve(startingCwd);
					} else {
						projectCwd = null;
					}
				}
				break;
		}

		configuration.startingCwd = startingCwd;
		configuration.projectCwd = projectCwd;

		configuration.importSettings(excludeCoreFields(coreDefinitions));

		const plugins = new Map<string, NoderalisPlugin>();

		const interop = (obj: any) => (obj.__esModule ? obj.default : obj);

		if (pluginConfiguration !== null) {
			for (const request of pluginConfiguration.plugins.keys())
				plugins.set(request, interop(pluginConfiguration.modules.get(request)));

			const requireEntries = new Map();
			for (const request of builtinModules())
				requireEntries.set(request, () => dynamicRequire(request));
			for (const [request, embedModule] of pluginConfiguration.modules)
				requireEntries.set(request, () => embedModule);

			const dynamicPlugins = new Set();

			const getDefault = (object: any) => {
				return object.default || object;
			};

			const importPlugin = (pluginPath: string, source: string) => {
				const { factory, name } = dynamicRequire(pluginPath);

				// Prevent plugin redefinition so that the ones declared deeper in the
				// filesystem always have precedence over the ones below.
				if (dynamicPlugins.has(name)) return;

				const pluginRequireEntries = new Map(requireEntries);
				const pluginRequire = (request: string) => {
					if (pluginRequireEntries.has(request)) {
						return pluginRequireEntries.get(request)();
					} else {
						throw new UsageError(
							`This plugin cannot access the package referenced via ${request} which is neither a builtin, nor an exposed entry`
						);
					}
				};

				const plugin = prettifySyncErrors(
					() => {
						return getDefault(factory(pluginRequire));
					},
					(message: any) => {
						return `${message} (when initializing ${name}, defined in ${source})`;
					}
				);

				requireEntries.set(name, () => plugin);

				dynamicPlugins.add(name);
				plugins.set(name, plugin);
			};

			if (environmentSettings.plugins) {
				for (const userProvidedPath of environmentSettings.plugins.split(`;`)) {
					const pluginPath = resolve(startingCwd, userProvidedPath);
					importPlugin(pluginPath, `<environment>`);
				}
			}
			for (const { path, cwd, data } of noderalisFiles) {
				if (!Array.isArray(data.plugins)) continue;

				for (const userPluginEntry of data.plugins) {
					const userProvidedPath =
						typeof userPluginEntry !== `string`
							? userPluginEntry.path
							: userPluginEntry;

					const pluginPath = resolve(cwd, userProvidedPath);
					importPlugin(pluginPath, path);
				}
			}
		}

		for (const [name, plugin] of plugins)
			configuration.activatePlugin(name, plugin);

		configuration.useWithSource(
			`<environment>`,
			excludeCoreFields(environmentSettings),
			startingCwd,
			{ strict }
		);
		for (const { path, cwd, data } of noderalisFiles)
			configuration.useWithSource(path, excludeCoreFields(data), cwd, {
				strict,
			});

		return configuration;
	}

	public projectCwd: string | null = null;
	public plugins: Map<string, NoderalisPlugin> = new Map();
	public settings: Map<string, Settings> = new Map();
	public values: Map<string, any> = new Map();
	public sources: Map<string, string> = new Map();
	public invalid: Map<string, string> = new Map();

	private constructor(protected startingCwd: string) {}

	private activatePlugin(name: string, plugin: NoderalisPlugin) {
		this.plugins.set(name, plugin);

		if (typeof plugin.configuration !== `undefined`) {
			this.importSettings(plugin.configuration);
		}
	}

	private importSettings(definitions: { [name: string]: Settings }) {
		for (const [name, definition] of Object.entries(definitions)) {
			if (this.settings.has(name))
				throw new Error(`Cannot redefine settings "${name}"`);

			this.settings.set(name, definition);
			this.values.set(name, getDefaultValue(this, definition));
		}
	}

	private useWithSource(
		source: string,
		data: { [key: string]: unknown },
		folder: string,
		{ strict = true }: { strict?: boolean } = {}
	) {
		try {
			for (const key of Object.keys(data)) {
				const value = data[key];

				if (typeof value === `undefined`) continue;
				if (key === `plugins`) continue;
				if (source === `<environment>` && IGNORED_ENV_VARIABLES.has(key))
					continue;

				const definition = this.settings.get(key);

				if (!definition) {
					if (strict) {
						console.log(strict);

						throw new UsageError(
							`Unrecognized configuration settings found: "${key}"\nrun "yarn config -v" to see the list of settings supported in Noderalis`
						);
					} else {
						this.invalid.set(key, source);
						continue;
					}
				}

				let parsed;

				try {
					parsed = parseValue(this, key, data[key], definition, folder);
				} catch (error) {
					error.message += `\nin ${source}`;

					throw error;
				}

				this.values.set(key, parsed);
				this.sources.set(key, source);
			}
		} catch (error) {
			error.message += `\nin ${source}`;

			throw error;
		}
	}
}
