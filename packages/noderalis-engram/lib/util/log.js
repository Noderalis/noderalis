"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
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
function log(caller, method, name, obj) {
    // console.log(
    // 	Chalk`[{redBright ${caller}}.{blueBright ${method}}()] ${name}: `,
    // 	inspect(obj, { colors: true, depth: Infinity }),
    // 	'\n'
    // );
    fs_1.appendFileSync(path_1.resolve(__dirname, '../test/trace.log'), `[${caller}.${method}()] ${name}: ` +
        util_1.inspect(obj, { depth: Infinity, compact: 1 }) +
        '\n', { encoding: 'utf-8' });
}
exports.log = log;
