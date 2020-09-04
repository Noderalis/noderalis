import { CommandClass } from 'clipanion';
import { Readable, Writable } from 'stream';
import { PluginConfiguration, Settings } from './Configuration';

export interface CommandContext {
  cwd: string;
  plugins: PluginConfiguration;
	quiet: boolean;
	stdin: Readable;
	stdout: Writable;
	stderr: Writable;
}

/**
 * Lifecycle hooks fired on specific events.
 */
export type Hooks = {

}

/**
 * A plugin configuration.
 * We don't expect much right now, so it's definitely minimal.
 */
export type Plugin<PluginHooks = any> = {
	configuration?: { [key: string]: Settings };
	commands?: Array<CommandClass<CommandContext>>;
	hooks?: PluginHooks;
};
