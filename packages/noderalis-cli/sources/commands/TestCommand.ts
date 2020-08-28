import { Command, UsageError } from 'clipanion';
import { notImpl } from '@noderalis/core';
import { BaseCommand } from '../tools/BaseCommand';

export class TestCommand extends BaseCommand {
  @Command.Path('test')
  async execute(): Promise<void> {
    throw new UsageError(notImpl);
  }
}

export default TestCommand;
