import { Command, Usage } from 'clipanion';
import { notImpl } from '@nodalis/core/sources';
import { BaseCommand } from '../tools/BaseCommand';

/**
 * Will eventually start a development server.
 */
export class StartCommand extends BaseCommand {
	static usage: Usage = Command.Usage({
		description: `a simple description`,
		details: `some details`,
		examples: [
			[`example1`, `$0`],
			[`example2`, `$0`],
		],
	});

	@Command.Path('start')
	async execute(): Promise<void> {
		this.stdout(this.context.cwd + '\n');
		this.stdout(notImpl);
	}
}

export default StartCommand;
