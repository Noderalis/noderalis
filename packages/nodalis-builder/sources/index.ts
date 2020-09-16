import { Cli } from 'clipanion';
import { BuildCommand } from './commands/BuildCommand';

const script = new Cli({
  binaryLabel: 'builder',
  binaryName: 'builder',
  binaryVersion: '1.0',
});
script.register(BuildCommand);

script.run(process.argv.slice(2), Cli.defaultContext);
