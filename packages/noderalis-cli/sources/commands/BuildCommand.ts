import { ProjectConfiguration } from '@noderalis/core';
import { Command } from 'clipanion';
import { BaseCommand } from '../tools/BaseCommand';
import spawn from 'cross-spawn'

/**
 * Builds projects in parallel using cross-spawn.
 *
 * @todo #3 Instead of using configs, generate them on-demand.
 */
export class BuildCommand extends BaseCommand {
  @Command.Boolean('prod, p')
  isProduction: boolean = false;

  @Command.Boolean('watch, w')
  watch: boolean = false;

  @Command.Path('build')
  async execute(): Promise<void> {
    await ProjectConfiguration.find();

    this.context.stdout.write(
      'Currently not supported internally, building external solution soon.'
    );

    // We still need to generate and write out the custom configuration.
    spawn('webpack',['--config','webpack.config.ts'])
    

    // const compiler = webpack(
    //   WebpackConfiguration.createWebpackConfig(this.context)
    // );

    // const buildErrors = await new Promise<string | null>((resolve, reject) => {
    //   compiler.run((error, stats) => {
    //     if (error) {
    //       reject(error);
    //     } else if (stats && stats.compilation.errors.length > 0) {
    //       resolve(stats.toString('errors-only'));
    //     } else {
    //       resolve(null);
    //     }
    //   });
    // });

    // if (buildErrors) {
    //   this.context.stdout.write(`Build failed:`);
    //   this.context.stdout.write(buildErrors);
    // } else {
    //   this.context.stdout.write(`Build successful`);
    // }
  }
}

export default BuildCommand;
