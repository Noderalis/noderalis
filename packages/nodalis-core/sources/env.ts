import Chalk from 'chalk';

export const env = {
  /** Are we running in `development`? */
  isDevelopment: process.env.BUILD_ENV == 'development',
  /** Are we running in `production`? */
  isProduction: process.env.BUILD_ENV == 'production',
};

export const notImpl = Chalk`Not Yet Implemented. Expected by {cyan v1.0.0}\n`;

export const identity = <T>(value: T): T => value;
