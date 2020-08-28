import { Command } from 'clipanion';
import { CommandContext } from '@noderalis/cli';

export abstract class BaseCommand extends Command<CommandContext> {
  abstract execute(): Promise<number | void>;

  stdout(chunk: unknown): void {
    this.context.stdout.write(chunk);
  }

  stderr(chunk: unknown): void {
    this.context.stderr.write(chunk);
  }
}
