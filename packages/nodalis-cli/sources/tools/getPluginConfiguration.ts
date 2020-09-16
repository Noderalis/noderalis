import pkg from '@nodalis/cli/package.json';
import { NodalisPluginConfiguration } from '@nodalis/core';
import { getDynamicLibs } from './getDynamicLibs';

export function getPluginConfiguration(): NodalisPluginConfiguration {
	const plugins = new Set<string>();
	for (const dependencyName of pkg[`@nodalis/builder`].bundles.standard)
		plugins.add(dependencyName);

	const modules = getDynamicLibs();
	for (const plugin of plugins) modules.set(plugin, require(plugin).default);

	return { plugins, modules };
}
