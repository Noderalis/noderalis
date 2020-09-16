/**
 * Will eventually be replaced by nLogr, as we *do* want to optionally trace a
 * definition from ingest to generation.
 *
 * @param caller What called the method.
 * @param method The method being run.
 * @param name The name of the internal call, this is for context in larger code blocks.
 * @param obj The data being passed to the method.
 *
 * @example
 * ```
 * log('SchemaBuilder', 'addType', 'typeDef', typeDef);
 *
 * // [SchemaBuilder.addType()] typeDef:  EngramExtendType {
 * //   name: 'Query',
 * //   config: { type: 'Query', definition: [Function: definition], name: 'Query' }
 * // }
 * ```
 */
export declare function log(caller: string, method: string, name: string, obj: any): void;
