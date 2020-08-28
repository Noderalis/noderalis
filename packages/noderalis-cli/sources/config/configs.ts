import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import done from './done.config';
import base from './base.config';
import { paths } from '@noderalis/core/sources';

const configs: Configuration[] = [
  merge(
    base,
    {
      entry: { 'bin/toolkit': paths.source.entry! },
    },
    done
  ),
];

export default configs;
