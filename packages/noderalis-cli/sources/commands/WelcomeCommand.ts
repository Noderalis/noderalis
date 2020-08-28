import { Command } from 'clipanion';
import { BaseCommand } from '../tools/BaseCommand';

const message = () => `
Welcome to Noderalis! A Node.js application framework!

I won't lie, Noderalis uses "arcanis/Clipanion" which is new and not
overly documented so I stripped some logic from Yarn 2 😅.
`;

export class WelcomeCommand extends BaseCommand {
  @Command.Path('--welcome')
  @Command.Path()
  async execute(): Promise<void> {
    this.context.stdout.write(`${message().trim()}\n`);
  }
}

export default WelcomeCommand;
