import { Command, Usage, UsageError } from 'clipanion';
import { notImpl } from '@nodalis/core';
import { BaseCommand } from '../tools/BaseCommand';

export class TestCommand extends BaseCommand {
	static usage: Usage = Command.Usage({
		description: `a simple description`,
		details: `some details`,
		examples: [
			[`example1`, `$0`],
			[`example2`, `$0`],
		],
	});

	@Command.Path('test')
	async execute(): Promise<void> {
		throw new UsageError(notImpl);
	}
}

export default TestCommand;
