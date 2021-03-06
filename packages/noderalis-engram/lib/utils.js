"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.casesHandled = exports.getOwnPackage = exports.pathToArray = exports.UNKNOWN_TYPE_SCALAR = exports.validateOnInstallHookResult = exports.venn = exports.log = exports.consoleWarn = exports.assertNoMissingTypes = exports.unwrapType = exports.printedGenTyping = exports.PrintedGenTyping = exports.printedGenTypingImport = exports.PrintedGenTypingImport = exports.relativePathTo = exports.isPromiseLike = exports.firstDefined = exports.isUnknownType = exports.groupTypes = exports.assertAbsolutePath = exports.isObject = exports.eachObj = exports.mapValues = exports.mapObj = exports.objValues = exports.suggestionList = exports.isInterfaceField = void 0;
const graphql_1 = require("graphql");
const path_1 = __importDefault(require("path"));
const decorateType_1 = require("./definitions/decorateType");
const _types_1 = require("./definitions/_types");
exports.isInterfaceField = (type, fieldName) => {
    return type.getInterfaces().some((i) => Boolean(i.getFields()[fieldName]));
};
// ----------------------------
/**
 *
 * Copied from graphql-js:
 *
 */
/**
 * Given an invalid input string and a list of valid options, returns a filtered
 * list of valid options sorted based on their similarity with the input.
 */
function suggestionList(input = '', options = []) {
    var optionsByDistance = Object.create(null);
    var oLength = options.length;
    var inputThreshold = input.length / 2;
    for (var i = 0; i < oLength; i++) {
        var distance = lexicalDistance(input, options[i]);
        var threshold = Math.max(inputThreshold, options[i].length / 2, 1);
        if (distance <= threshold) {
            optionsByDistance[options[i]] = distance;
        }
    }
    return Object.keys(optionsByDistance).sort(function (a, b) {
        return optionsByDistance[a] - optionsByDistance[b];
    });
}
exports.suggestionList = suggestionList;
/**
 * Computes the lexical distance between strings A and B.
 *
 * The "distance" between two strings is given by counting the minimum number
 * of edits needed to transform string A into string B. An edit can be an
 * insertion, deletion, or substitution of a single character, or a swap of two
 * adjacent characters.
 *
 * Includes a custom alteration from Damerau-Levenshtein to treat case changes
 * as a single edit which helps identify mis-cased values with an edit distance
 * of 1.
 *
 * This distance can be useful for detecting typos in input or sorting
 */
function lexicalDistance(aStr, bStr) {
    if (aStr === bStr) {
        return 0;
    }
    let i;
    let j;
    const d = [];
    const a = aStr.toLowerCase();
    const b = bStr.toLowerCase();
    const aLength = a.length;
    const bLength = b.length; // Any case change counts as a single edit
    if (a === b) {
        return 1;
    }
    for (i = 0; i <= aLength; i++) {
        d[i] = [i];
    }
    for (j = 1; j <= bLength; j++) {
        d[0][j] = j;
    }
    for (i = 1; i <= aLength; i++) {
        for (j = 1; j <= bLength; j++) {
            var cost = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }
    return d[aLength][bLength];
}
// ----------------------------
function objValues(obj) {
    return Object.keys(obj).reduce((result, key) => {
        result.push(obj[key]);
        return result;
    }, []);
}
exports.objValues = objValues;
function mapObj(obj, mapper) {
    return Object.keys(obj).map((key, index) => mapper(obj[key], key, index));
}
exports.mapObj = mapObj;
function mapValues(obj, mapper) {
    const result = {};
    Object.keys(obj).forEach((key, index) => (result[key] = mapper(obj[key], key, index)));
    return result;
}
exports.mapValues = mapValues;
function eachObj(obj, iter) {
    Object.keys(obj).forEach((name, i) => iter(obj[name], name, i));
}
exports.eachObj = eachObj;
exports.isObject = (obj) => obj !== null && typeof obj === 'object';
exports.assertAbsolutePath = (pathName, property) => {
    if (!path_1.default.isAbsolute(pathName)) {
        throw new Error(`Expected path for ${property} to be an absolute path, saw ${pathName}`);
    }
    return pathName;
};
function groupTypes(schema) {
    const groupedTypes = {
        input: [],
        interface: [],
        object: [],
        union: [],
        enum: [],
        scalar: Array.from(graphql_1.specifiedScalarTypes),
    };
    const schemaTypeMap = schema.getTypeMap();
    Object.keys(schemaTypeMap)
        .sort()
        .forEach((typeName) => {
        if (typeName.indexOf('__') === 0) {
            return;
        }
        const type = schema.getType(typeName);
        if (graphql_1.isObjectType(type)) {
            groupedTypes.object.push(type);
        }
        else if (graphql_1.isInputObjectType(type)) {
            groupedTypes.input.push(type);
        }
        else if (graphql_1.isScalarType(type) &&
            !graphql_1.isSpecifiedScalarType(type) &&
            !isUnknownType(type)) {
            groupedTypes.scalar.push(type);
        }
        else if (graphql_1.isUnionType(type)) {
            groupedTypes.union.push(type);
        }
        else if (graphql_1.isInterfaceType(type)) {
            groupedTypes.interface.push(type);
        }
        else if (graphql_1.isEnumType(type)) {
            groupedTypes.enum.push(type);
        }
    });
    return groupedTypes;
}
exports.groupTypes = groupTypes;
function isUnknownType(type) {
    return type.name === exports.UNKNOWN_TYPE_SCALAR.name;
}
exports.isUnknownType = isUnknownType;
function firstDefined(...args) {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg !== 'undefined') {
            return arg;
        }
    }
    /* istanbul ignore next */
    throw new Error('At least one of the values should be defined');
}
exports.firstDefined = firstDefined;
function isPromiseLike(value) {
    return Boolean(value && typeof value.then === 'function');
}
exports.isPromiseLike = isPromiseLike;
function relativePathTo(absolutePath, outputPath) {
    const filename = path_1.default.basename(absolutePath).replace(/(\.d)?\.ts/, '');
    const relative = path_1.default.relative(path_1.default.dirname(outputPath), path_1.default.dirname(absolutePath));
    if (relative.indexOf('.') !== 0) {
        return `./${path_1.default.join(relative, filename)}`;
    }
    return path_1.default.join(relative, filename);
}
exports.relativePathTo = relativePathTo;
class PrintedGenTypingImport {
    constructor(config) {
        this.config = config;
    }
}
exports.PrintedGenTypingImport = PrintedGenTypingImport;
_types_1.withEngramSymbol(PrintedGenTypingImport, _types_1.EngramTypes.PrintedGenTypingImport);
function printedGenTypingImport(config) {
    return new PrintedGenTypingImport(config);
}
exports.printedGenTypingImport = printedGenTypingImport;
class PrintedGenTyping {
    constructor(config) {
        this.config = config;
    }
    get imports() {
        return this.config.imports || [];
    }
    toString() {
        let str = ``;
        if (this.config.description) {
            const descriptionLines = this.config.description
                .split('\n')
                .map((s) => s.trim())
                .filter((s) => s)
                .map((s) => ` * ${s}`)
                .join('\n');
            str = `/**\n${descriptionLines}\n */\n`;
        }
        const field = `${this.config.name}${this.config.optional ? '?' : ''}`;
        str += `${field}: ${this.config.type}`;
        return str;
    }
}
exports.PrintedGenTyping = PrintedGenTyping;
_types_1.withEngramSymbol(PrintedGenTyping, _types_1.EngramTypes.PrintedGenTyping);
function printedGenTyping(config) {
    return new PrintedGenTyping(config);
}
exports.printedGenTyping = printedGenTyping;
function unwrapType(type) {
    let finalType = type;
    let isNonNull = false;
    const list = [];
    while (graphql_1.isWrappingType(finalType)) {
        while (graphql_1.isListType(finalType)) {
            finalType = finalType.ofType;
            if (graphql_1.isNonNullType(finalType)) {
                finalType = finalType.ofType;
                list.unshift(true);
            }
            else {
                list.unshift(false);
            }
        }
        if (graphql_1.isNonNullType(finalType)) {
            isNonNull = true;
            finalType = finalType.ofType;
        }
    }
    return { type: finalType, isNonNull, list };
}
exports.unwrapType = unwrapType;
function assertNoMissingTypes(schema, missingTypes) {
    const missingTypesNames = Object.keys(missingTypes);
    const schemaTypeMap = schema.getTypeMap();
    const schemaTypeNames = Object.keys(schemaTypeMap).filter((typeName) => !isUnknownType(schemaTypeMap[typeName]));
    if (missingTypesNames.length > 0) {
        const errors = missingTypesNames
            .map((typeName) => {
            const { fromObject } = missingTypes[typeName];
            if (fromObject) {
                return `- Looks like you forgot to import ${typeName} in the root "types" passed to Engram makeSchema`;
            }
            const suggestions = suggestionList(typeName, schemaTypeNames);
            let suggestionsString = '';
            if (suggestions.length > 0) {
                suggestionsString = ` or mean ${suggestions.join(', ')}`;
            }
            return `- Missing type ${typeName}, did you forget to import a type to the root query${suggestionsString}?`;
        })
            .join('\n');
        throw new Error('\n' + errors);
    }
}
exports.assertNoMissingTypes = assertNoMissingTypes;
function consoleWarn(msg) {
    console.warn(msg);
}
exports.consoleWarn = consoleWarn;
function log(msg) {
    console.log(`Engram Schema: ${msg}`);
}
exports.log = log;
/**
 * Calculate the venn diagram between two iterables based on reference equality
 * checks. The returned tripple contains items thusly:
 *
 *    * items only in arg 1 --> first tripple slot
 *    * items in args 1 & 2 --> second tripple slot
 *    * items only in arg 2 --> third tripple slot
 */
function venn(xs, ys) {
    const lefts = new Set(xs);
    const boths = new Set();
    const rights = new Set(ys);
    lefts.forEach((l) => {
        if (rights.has(l)) {
            boths.add(l);
            lefts.delete(l);
            rights.delete(l);
        }
    });
    return [lefts, boths, rights];
}
exports.venn = venn;
/**
 * Validate that the data returned from a plugin from the `onInstall` hook is valid.
 */
function validateOnInstallHookResult(pluginName, hookResult) {
    if (!Array.isArray(hookResult === null || hookResult === void 0 ? void 0 : hookResult.types)) {
        throw new Error(`Plugin "${pluginName}" returned invalid data for "onInstall" hook:\n\nexpected structure:\n\n  { types: EngramAcceptedTypeDef[] }\n\ngot:\n\n  ${hookResult}`);
    }
    // TODO we should validate that the array members all fall under EngramAcceptedTypeDef
}
exports.validateOnInstallHookResult = validateOnInstallHookResult;
exports.UNKNOWN_TYPE_SCALAR = decorateType_1.decorateType(new graphql_1.GraphQLScalarType({
    name: 'ENGRAM__UNKNOWN__TYPE',
    description: `
    This scalar should never make it into production. It is used as a placeholder for situations
    where GraphQL Engram encounters a missing type. We don't want to error immedately, otherwise
    the TypeScript definitions will not be updated.
  `,
    parseValue(value) {
        throw new Error('Error: ENGRAM__UNKNOWN__TYPE is not a valid scalar.');
    },
    parseLiteral(value) {
        throw new Error('Error: ENGRAM__UNKNOWN__TYPE is not a valid scalar.');
    },
    serialize(value) {
        throw new Error('Error: ENGRAM__UNKNOWN__TYPE is not a valid scalar.');
    },
}), {
    rootTyping: 'never',
});
function pathToArray(infoPath) {
    const flattened = [];
    let curr = infoPath;
    while (curr) {
        flattened.push(curr.key);
        curr = curr.prev;
    }
    return flattened.reverse();
}
exports.pathToArray = pathToArray;
function getOwnPackage() {
    return require('../package.json');
}
exports.getOwnPackage = getOwnPackage;
/**
 * Use this to make assertion at end of if-else chain that all members of a
 * union have been accounted for.
 */
function casesHandled(x) {
    throw new Error(`A case was not handled for value: ${x}`);
}
exports.casesHandled = casesHandled;
