import { Command } from 'clipanion';
import { ESLint } from 'eslint';
import { BaseCommand } from '../tools/BaseCommand';

/**
 * Programmatically runs ESLint and auto-fixes issues.
 */
export class LintCommand extends BaseCommand {
  @Command.Path('lint')
  async execute(): Promise<void> {
    this.context.stdout.write('Linting...\n');
    const linter = new ESLint({
      fix: true,
    });

    // TODO: #2 determine what to lint, and what directories should be linted. @TheGrimSilence
    const results = await linter.lintFiles('./src/**/*.{ts, tsx}');
    await ESLint.outputFixes(results);

    const formatter = await linter.loadFormatter('stylish');
    const resultFormatted = formatter.format(results);

    this.context.stdout.write(resultFormatted);
  }
}

export default LintCommand;
