import { CommandContext } from '@noderalis/core/sources/Plugin';
import { Command } from 'clipanion';

export abstract class BaseCommand extends Command<CommandContext> {
	abstract execute(): Promise<number | void>;

	stdout(chunk: unknown): void {
		this.context.stdout.write(chunk);
	}

	stderr(chunk: unknown): void {
		this.context.stderr.write(chunk);
	}
}
