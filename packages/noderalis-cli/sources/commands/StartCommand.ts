import { Command } from 'clipanion';
import { notImpl } from '@noderalis/core/sources';
import { BaseCommand } from '../tools/BaseCommand';

/**
 * Will eventually start a development server.
 */
export class StartCommand extends BaseCommand {
  @Command.Path('start')
  async execute(): Promise<void> {
    this.stdout(this.context.cwd);
    this.stdout(notImpl);
  }
}

export default StartCommand;
