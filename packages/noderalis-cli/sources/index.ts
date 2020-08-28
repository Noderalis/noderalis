// import { createPromptModule } from 'inquirer';
import { BaseContext, Cli } from 'clipanion';
import commands from './commands/commands';
export { BaseCommand } from './tools/BaseCommand';

export type CommandContext = BaseContext & {
	cwd: string;
	quiet: boolean;
};

/**
 * Recursively register commands in `commands/`
 * @param cli the Clipanion instance.
 */
async function registerCommands(cli: Cli<CommandContext>) {
	for (const command of commands) {
		cli.register(command);
	}
}

// const prompt = createPromptModule({
//   input: this.context.stdin,
//   output: this.context.stdout,
// });

async function main() {
	async function run(): Promise<void> {
		const cli = new Cli<CommandContext>({
			binaryLabel: 'Noderalis',
			binaryName: 'noderalis',
			binaryVersion: '0.1.0',
		});

		registerCommands(cli);

		try {
			await exec(cli);
		} catch (error) {
			process.stdout.write(cli.error(error));
			process.exitCode = 1;
		}
	}

	async function exec(cli: Cli<CommandContext>): Promise<void> {
		const command = cli.process(process.argv.slice(2));
		cli.runExit(command, {
			cwd: process.cwd(),
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

main();
