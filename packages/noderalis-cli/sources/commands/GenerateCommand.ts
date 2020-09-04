import { Command, Usage, UsageError } from 'clipanion';
import { notImpl } from '@noderalis/core/sources';
import { BaseCommand } from '../tools/BaseCommand';

/**
 * Generates a new repository from a Noderalis template.
 */
export class GenerateCommand extends BaseCommand {
	@Command.String('--list', { tolerateBoolean: false })
  list: boolean = false;
  
	static usage: Usage = Command.Usage({
		description: `a simple description`,
		details: `some details`,
		examples: [
			[`example1`, `$0`],
			[`example2`, `$0`],
		],
	});

	// const prompt = inquirer.createPromptModule({
	//   input: this.context.stdin,
	//   output: this.context.stdout,
	// });

	@Command.Path('generate')
	@Command.Path('g')
	async execute(): Promise<void> {
		throw new UsageError(notImpl);
	}
}

export default GenerateCommand;
