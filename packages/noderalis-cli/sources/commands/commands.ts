import { CommandContext } from '@noderalis/core/sources/NoderalisPlugin';
import { CommandClass } from 'clipanion';
import { GenerateCommand } from './GenerateCommand';
// import { LintCommand } from './LintCommand';
import { StartCommand } from './StartCommand';
import { TestCommand } from './TestCommand';
import { WelcomeCommand } from './WelcomeCommand';
import HelpCommand from './HelpCommand';

const commands: CommandClass<CommandContext>[] = [
	GenerateCommand,
	// LintCommand,
	HelpCommand,
	StartCommand,
	TestCommand,
	WelcomeCommand,
];

export default commands;
