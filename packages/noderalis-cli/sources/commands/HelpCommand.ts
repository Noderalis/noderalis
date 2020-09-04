import { CommandContext } from '@noderalis/core/sources/Plugin';
import { Command, Usage } from 'clipanion';

export default class HelpCommand extends Command<CommandContext> {
	static usage: Usage = Command.Usage({
		description: `a simple description`,
		details: `some details`,
		examples: [
			[`example1`, `$0`],
			[`example2`, `$0`],
		],
	});

	@Command.Path(`help`)
	@Command.Path(`--help`)
	@Command.Path(`-h`)
	async execute() {
		this.context.stdout.write(this.cli.usage(null));
	}
}
