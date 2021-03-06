import { GraphQLNamedType, GraphQLSchema } from 'graphql';
import { TypegenInfo } from './builder';
/**
 * Any common types / constants that would otherwise be circular-imported
 */
export declare const SCALAR_TYPES: {
    Int: string;
    String: string;
    ID: string;
    Float: string;
    Boolean: string;
};
export interface TypegenConfigSourceModule {
    /**
     * The module for where to look for the types.
     * This uses the node resolution algorthm via require.resolve,
     * so if this lives in node_modules, you can just provide the module name
     * otherwise you should provide the absolute path to the file.
     */
    source: string;
    /**
     * When we import the module, we use `import * as ____` to prevent
     * conflicts. This alias should be a name that doesn't conflict with any other
     * types, usually a short lowercase name.
     */
    alias: string;
    /**
     * Provides a custom approach to matching for the type
     *
     * If not provided, the default implementation is:
     *
     *   (type) => [
     *      new RegExp(`(?:interface|type|class|enum)\\s+(${type.name})\\W`, "g"),
     *   ]
     *
     */
    typeMatch?: (type: GraphQLNamedType, defaultRegex: RegExp) => RegExp | RegExp[];
    /**
     * A list of typesNames or regular expressions matching type names
     * that should be resolved by this import. Provide an empty array if you
     * wish to use the file for context and ensure no other types are matched.
     */
    onlyTypes?: (string | RegExp)[];
    /**
     * By default the import is configured `import * as alias from`, setting glob to false
     * will change this to `import alias from`
     */
    glob?: false;
}
export interface TypegenAutoConfigOptions {
    /**
     * Any headers to prefix on the generated type file
     */
    headers?: string[];
    /**
     * Array of TypegenConfigSourceModule's to look in and match the type names against.
     *
     * ```
     * sources: [
     *   { source: 'typescript', alias: 'ts' },
     *   { source: path.join(__dirname, '../backingTypes'), alias: 'b' },
     * ]
     * ```
     */
    sources: TypegenConfigSourceModule[];
    /**
     * Typing for the context, referencing a type defined in the aliased module
     * provided in sources e.g. `alias.Context`
     */
    contextType?: string;
    /**
     * Types that should not be matched for a backing type,
     *
     * By default this is set to ['Query', 'Mutation', 'Subscription']
     *
     * ```
     * skipTypes: ['Query', 'Mutation', /(.*?)Edge/, /(.*?)Connection/]
     * ```
     */
    skipTypes?: (string | RegExp)[];
    /**
     * If debug is set to true, this will log out info about all types
     * found, skipped, etc. for the type generation files.
     */
    debug?: boolean;
    /**
     * If provided this will be used for the backing types rather than the auto-resolve
     * mechanism above. Useful as an override for one-off cases, or for scalar
     * backing types.
     */
    backingTypeMap?: Record<string, string>;
}
/**
 * This is an approach for handling type definition auto-resolution.
 * It is designed to handle the most common cases, as can be seen
 * in the examples / the simplicity of the implementation.
 *
 * If you wish to do something more complex, involving full
 * AST parsing, etc, you can provide a different function to
 * the `typegenInfo` property of the `makeSchema` config.
 *
 * @param options
 */
export declare function typegenAutoConfig(options: TypegenAutoConfigOptions): (schema: GraphQLSchema, outputPath: string) => Promise<TypegenInfo>;
