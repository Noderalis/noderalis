import { CommandClass } from 'clipanion';
import { CommandContext } from '..';
import { BuildCommand } from './BuildCommand';
import { GenerateCommand } from './GenerateCommand';
// import { LintCommand } from './LintCommand';
import { StartCommand } from './StartCommand';
import { TestCommand } from './TestCommand';
import { WelcomeCommand } from './WelcomeCommand';

const commands: CommandClass<CommandContext>[] = [
  BuildCommand,
  GenerateCommand,
  // LintCommand,
  StartCommand,
  TestCommand,
  WelcomeCommand,
];

export default commands;
