import { CommandClass } from 'clipanion';
import { Readable, Writable } from 'stream';
import { NoderalisPluginConfiguration, Settings } from './Configuration';

export interface CommandContext {
  cwd: string;
  plugins: NoderalisPluginConfiguration;
	quiet: boolean;
	stdin: Readable;
	stdout: Writable;
	stderr: Writable;
}

/**
 * Lifecycle hooks fired on specific events.
 */
export type NoderalisHooks = {

}

/**
 * A plugin configuration.
 * We don't expect much right now, so it's definitely minimal.
 */
export type NoderalisPlugin<NoderalisPluginHooks = any> = {
	configuration?: { [key: string]: Settings };
	commands?: Array<CommandClass<CommandContext>>;
	hooks?: NoderalisPluginHooks;
};
