import { BuilderConfig } from './builder';
import { TypegenMetadataConfig } from './typegenMetadata';
/**
 * Normalizes the builder config into the config we need for typegen
 *
 * @param config {BuilderConfig}
 */
export declare function resolveTypegenConfig(config: BuilderConfig): TypegenMetadataConfig;
