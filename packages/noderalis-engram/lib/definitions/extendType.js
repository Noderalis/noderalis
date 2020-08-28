"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendType = exports.EngramExtendTypeDef = void 0;
const graphql_1 = require("graphql");
const _types_1 = require("./_types");
class EngramExtendTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        graphql_1.assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
exports.EngramExtendTypeDef = EngramExtendTypeDef;
_types_1.withEngramSymbol(EngramExtendTypeDef, _types_1.EngramTypes.ExtendObject);
/**
 * Adds new fields to an existing objectType in the schema. Useful when
 * splitting your schema across several domains.
 *
 * @see http://graphql-engram.com/api/extendType
 */
function extendType(config) {
    return new EngramExtendTypeDef(config.type, { ...config, name: config.type });
}
exports.extendType = extendType;
