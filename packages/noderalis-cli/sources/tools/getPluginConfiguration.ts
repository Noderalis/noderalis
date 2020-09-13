import pkg from '@noderalis/cli/package.json';
import { NoderalisPluginConfiguration } from '@noderalis/core';
import { getDynamicLibs } from './getDynamicLibs';

export function getPluginConfiguration(): NoderalisPluginConfiguration {
	const plugins = new Set<string>();
	for (const dependencyName of pkg[`@noderalis/builder`].bundles.standard)
		plugins.add(dependencyName);

	const modules = getDynamicLibs();
	for (const plugin of plugins) modules.set(plugin, require(plugin).default);

	return { plugins, modules };
}
