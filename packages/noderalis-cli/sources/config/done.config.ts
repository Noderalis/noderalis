import { Configuration, Compiler } from 'webpack';
import { env } from '@noderalis/core/sources';

/**
 * Shuts down webpack when compiling is finished. This prevents hanging builds
 * on GitHub Actions.
 */
const done: Configuration = {
  plugins: [
    {
      apply: (compiler: Compiler): void => {
        compiler.hooks.done.tap('Done', (_stats) => {
          if (env.isProduction) {
            setTimeout(() => {
              console.log(`Compilation complete. Ending build process...`);
              console.log(_stats);

              process.exit(0);
            }, 0);
          }
        });
      },
    },
  ],
};

export default done;
