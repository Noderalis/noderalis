import { Command } from 'clipanion';
import { WebpackConfiguration } from '../tools/makeConfig';

export class BuildCommand extends Command {
  @Command.Path('build')
  async execute() {
    this.context.stdout.write('Hello, Bob!\n');
    // Generate a new webpack config, write it to a file, cross-spawn webpack
    new WebpackConfiguration().run();
  }
}
