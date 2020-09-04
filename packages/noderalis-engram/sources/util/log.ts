import { appendFileSync } from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';

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
export function log(caller: string, method: string, name: string, obj: any) {
	// console.log(
	// 	Chalk`[{redBright ${caller}}.{blueBright ${method}}()] ${name}: `,
	// 	inspect(obj, { colors: true, depth: Infinity }),
	// 	'\n'
	// );
	appendFileSync(
		resolve(__dirname, '../test/trace.log'),
		`[${caller}.${method}()] ${name}: ` +
			inspect(obj, { depth: Infinity, compact: 1 }) +
			'\n',
		{ encoding: 'utf-8' }
	);
}
