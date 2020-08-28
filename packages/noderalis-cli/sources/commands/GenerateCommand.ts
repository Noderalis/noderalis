import { Command, UsageError } from 'clipanion';
import { notImpl } from '@noderalis/core/sources';
import { BaseCommand } from '../tools/BaseCommand';

/**
 * Generates a new repository from a Noderalis template.
 */
export class GenerateCommand extends BaseCommand {
  @Command.String('--list', { tolerateBoolean: false })
  list: boolean = false;

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
