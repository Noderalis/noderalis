import { Configuration, NoderalisPluginConfiguration } from '@noderalis/core';
import { CommandContext } from '@noderalis/core/sources/NoderalisPlugin';
import { Cli } from 'clipanion';
import commands from './commands/commands';
export { BaseCommand } from './tools/BaseCommand';

/**
 * Recursively register commands in `commands/`
 * @param cli the Clipanion instance.
 */
async function registerCommands(cli: Cli<CommandContext>) {
	for (const command of commands) {
		cli.register(command);
	}
}

export async function main(pluginConfiguration: NoderalisPluginConfiguration) {
	async function run(): Promise<void> {
		const cli = new Cli<CommandContext>({
			binaryLabel: 'Noderalis',
			binaryName: 'noderalis',
			binaryVersion: '0.1.0',
		});

		try {
			await exec(cli);
		} catch (error) {
			process.stdout.write(cli.error(error));
			process.exitCode = 1;
		}
	}

	async function exec(cli: Cli<CommandContext>): Promise<void> {
		const configuration = await Configuration.find(
			process.cwd(),
			pluginConfiguration,
			{
				strict: false,
			}
		);

		registerCommands(cli);

		for (const [_, plugin] of configuration.plugins.entries()) {
			// Eventually implement telemetry for Noderalis applications such as DeGraphe.
			// if (pluginCommands.has(name.match(/^@noderalis\/plugin-(.*)$/)?.[1] ?? ``))
			// 	Configuration.telemetry?.reportPluginName(name);

			for (const command of plugin.commands || []) {
				cli.register(command);
			}
		}

		const command = cli.process(process.argv.slice(2));

		cli.runExit(command, {
			cwd: process.cwd(),
			plugins: pluginConfiguration,
			quiet: false,
			stdin: process.stdin,
			stdout: process.stdout,
			stderr: process.stderr,
		});
	}

	return run().catch((error) => {
		process.stdout.write(error.stack || error.message);
		process.exitCode = 1;
	});
}
