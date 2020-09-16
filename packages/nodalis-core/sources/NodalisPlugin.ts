import { CommandClass } from 'clipanion';
import { Readable, Writable } from 'stream';
import { NodalisPluginConfiguration, Settings } from './Configuration';

export interface CommandContext {
	cwd: string;
	plugins: NodalisPluginConfiguration;
	quiet: boolean;
	stdin: Readable;
	stdout: Writable;
	stderr: Writable;
}

/**
 * Lifecycle hooks fired on specific events.
 */
export type NodalisHooks = {};

/**
 * A plugin configuration.
 * We don't expect much right now, so it's definitely minimal.
 */
export type NodalisPlugin<NodalisPluginHooks = any> = {
	configuration?: { [key: string]: Settings };
	commands?: Array<CommandClass<CommandContext>>;
	hooks?: NodalisPluginHooks;
};
