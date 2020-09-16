import { Configuration } from '@nodalis/core';
import { Command, Usage, UsageError } from 'clipanion';
import { BaseCommand } from '../tools/BaseCommand';

// const message = () => `
// Welcome to Nodalis! A Node.js application framework!
// `;

export class WelcomeCommand extends BaseCommand {
	@Command.Proxy()
	args: Array<string> = [];

	static usage: Usage = Command.Usage({
		description: `a simple description`,
		details: `some details`,
		examples: [
			[`example1`, `$0`],
			[`example2`, `$0`],
		],
	});

	@Command.Path('--welcome')
	@Command.Path()
	async execute(): Promise<void> {
		const configuration = await Configuration.find(
			this.context.cwd,
			this.context.plugins
		);
		// this.context.stdout.write(`${message().trim()}\n`);
		throw new UsageError(`Nope ${configuration}`);
	}
}

export default WelcomeCommand;
