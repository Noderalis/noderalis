import { Configuration } from 'webpack';
import { IToolkitPaths } from './paths';

/**
 * The toolkit configuration is an optional config file that adds extra webpack configs
 * which will be added to the base configuration. It has restricted `webpack.Configuration`
 * types to reduce conflicting definitions.
 */
export interface NoderalisConfig {
  /** An array of configs with restricted webpack support. */
  builds?: Configuration;
  /** Adds additional paths to the toolkit scope. */
  paths?: IToolkitPaths;
  /**
   * - "webpack" Only output in relation with Webpack. (webpack, parallel-webpack)
   * - "open" Output everything from the toolkit and its dependencies. (webpack+)
   * - "silent" Self explanatory.
   */
  verbosity?: 'webpack' | 'open' | 'silent';
}
