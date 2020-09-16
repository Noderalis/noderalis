"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typegenAutoConfig = exports.SCALAR_TYPES = void 0;
const graphql_1 = require("graphql");
const path_1 = __importDefault(require("path"));
const lang_1 = require("./lang");
const utils_1 = require("./utils");
/**
 * Any common types / constants that would otherwise be circular-imported
 */
exports.SCALAR_TYPES = {
    Int: 'number',
    String: 'string',
    ID: 'string',
    Float: 'number',
    Boolean: 'boolean',
};
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
function typegenAutoConfig(options) {
    return async (schema, outputPath) => {
        const { headers, contextType, skipTypes = ['Query', 'Mutation', 'Subscription'], backingTypeMap: _backingTypeMap, debug, } = options;
        const typeMap = schema.getTypeMap();
        const typesToIgnore = new Set();
        const typesToIgnoreRegex = [];
        const allImportsMap = {};
        const importsMap = {};
        const backingTypeMap = {
            ...exports.SCALAR_TYPES,
            ..._backingTypeMap,
        };
        const forceImports = new Set(utils_1.objValues(backingTypeMap)
            .concat(contextType || '')
            .map((t) => {
            const match = t.match(/^(\w+)\./);
            return match ? match[1] : null;
        })
            .filter((f) => f));
        skipTypes.forEach((skip) => {
            if (typeof skip === 'string') {
                typesToIgnore.add(skip);
            }
            else if (skip instanceof RegExp) {
                typesToIgnoreRegex.push(skip);
            }
            else {
                throw new Error('Invalid type for options.skipTypes, expected string or RegExp');
            }
        });
        const typeSources = await Promise.all(options.sources.map(async (source) => {
            // Keeping all of this in here so if we don't have any sources
            // e.g. in the Playground, it doesn't break things.
            // Yeah, this doesn't exist in Node 6, but since this is a new
            // lib and Node 6 is close to EOL so if you really need it, open a PR :)
            const fs = require('fs');
            const util = require('util');
            const readFile = util.promisify(fs.readFile);
            const { source: pathOrModule, glob = true, onlyTypes, alias, typeMatch, } = source;
            if (path_1.default.isAbsolute(pathOrModule) &&
                path_1.default.extname(pathOrModule) !== '.ts') {
                return console.warn(`Engram Schema Typegen: Expected module ${pathOrModule} to be an absolute path to a TypeScript module, skipping.`);
            }
            let resolvedPath;
            let fileContents;
            try {
                resolvedPath = require.resolve(pathOrModule, {
                    paths: [process.cwd()],
                });
                if (path_1.default.extname(resolvedPath) !== '.ts') {
                    resolvedPath = findTypingForFile(resolvedPath, pathOrModule);
                }
                fileContents = await readFile(resolvedPath, 'utf-8');
            }
            catch (e) {
                if (e instanceof Error &&
                    e.message.indexOf('Cannot find module') !== -1) {
                    console.error(`GraphQL Engram: Unable to find file or module ${pathOrModule}, skipping`);
                }
                else {
                    console.error(e.message);
                }
                return null;
            }
            const importPath = (path_1.default.isAbsolute(pathOrModule)
                ? utils_1.relativePathTo(resolvedPath, outputPath)
                : pathOrModule).replace(/(\.d)?\.ts/, '');
            if (allImportsMap[alias] && allImportsMap[alias] !== importPath) {
                return console.warn(`Engram Schema Typegen: Cannot have multiple type sources ${importsMap[alias]} and ${pathOrModule} with the same alias ${alias}, skipping`);
            }
            allImportsMap[alias] = importPath;
            if (forceImports.has(alias)) {
                importsMap[alias] = [importPath, glob];
                forceImports.delete(alias);
            }
            return {
                alias,
                glob,
                importPath,
                fileContents,
                onlyTypes,
                typeMatch: typeMatch || defaultTypeMatcher,
            };
        }));
        const builtinScalars = new Set(Object.keys(exports.SCALAR_TYPES));
        Object.keys(typeMap).forEach((typeName) => {
            if (typeName.indexOf('__') === 0) {
                return;
            }
            if (typesToIgnore.has(typeName)) {
                return;
            }
            if (typesToIgnoreRegex.some((r) => r.test(typeName))) {
                return;
            }
            if (backingTypeMap[typeName]) {
                return;
            }
            if (builtinScalars.has(typeName)) {
                return;
            }
            const type = schema.getType(typeName);
            // For now we'll say that if it's output type it can be backed
            if (graphql_1.isOutputType(type)) {
                for (let i = 0; i < typeSources.length; i++) {
                    const typeSource = typeSources[i];
                    if (!typeSource) {
                        continue;
                    }
                    // If we've specified an array of "onlyTypes" to match ensure the
                    // `typeName` falls within that list.
                    if (typeSource.onlyTypes) {
                        if (!typeSource.onlyTypes.some((t) => {
                            return t instanceof RegExp ? t.test(typeName) : t === typeName;
                        })) {
                            continue;
                        }
                    }
                    const { fileContents, importPath, glob, alias, typeMatch, } = typeSource;
                    const typeRegex = typeMatch(type, defaultTypeMatcher(type)[0]);
                    const matched = firstMatch(fileContents, Array.isArray(typeRegex) ? typeRegex : [typeRegex]);
                    if (matched) {
                        if (debug) {
                            utils_1.log(`Matched type - ${typeName} in "${importPath}" - ${alias}.${matched[1]}`);
                        }
                        importsMap[alias] = [importPath, glob];
                        backingTypeMap[typeName] = `${alias}.${matched[1]}`;
                    }
                    else {
                        if (debug) {
                            utils_1.log(`No match for ${typeName} in "${importPath}" using ${typeRegex}`);
                        }
                    }
                }
            }
        });
        if (forceImports.size > 0) {
            console.error(`Missing required typegen import: ${Array.from(forceImports)}`);
        }
        const imports = [];
        Object.keys(importsMap)
            .sort()
            .forEach((alias) => {
            const [importPath, glob] = importsMap[alias];
            const safeImportPath = importPath.replace(/\\+/g, '/');
            imports.push(`import ${glob ? '* as ' : ''}${alias} from "${safeImportPath}"`);
        });
        const typegenInfo = {
            headers: headers || [lang_1.TYPEGEN_HEADER],
            backingTypeMap,
            imports,
            contextType,
            engramSchemaImportId: utils_1.getOwnPackage().name,
        };
        return typegenInfo;
    };
}
exports.typegenAutoConfig = typegenAutoConfig;
function findTypingForFile(absolutePath, pathOrModule) {
    // First try to find the "d.ts" adjacent to the file
    try {
        const typeDefPath = absolutePath.replace(path_1.default.extname(absolutePath), '.d.ts');
        require.resolve(typeDefPath);
        return typeDefPath;
    }
    catch (e) {
        console.error(e);
    }
    // TODO: need to figure out cases where it's a node module
    // and "typings" is set in the package.json
    throw new Error(`Unable to find typings associated with ${pathOrModule}, skipping`);
}
const firstMatch = (fileContents, typeRegex) => {
    for (let i = 0; i < typeRegex.length; i++) {
        const regex = typeRegex[i];
        const match = regex.exec(fileContents);
        if (match) {
            return match;
        }
    }
    return null;
};
const defaultTypeMatcher = (type) => {
    return [
        new RegExp(`(?:interface|type|class|enum)\\s+(${type.name})\\W`, 'g'),
    ];
};
