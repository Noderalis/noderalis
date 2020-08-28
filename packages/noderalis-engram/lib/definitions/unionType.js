"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionType = exports.EngramUnionTypeDef = exports.UnionDefinitionBlock = void 0;
const graphql_1 = require("graphql");
const _types_1 = require("./_types");
class UnionDefinitionBlock {
    constructor(typeBuilder) {
        this.typeBuilder = typeBuilder;
    }
    /**
     * All ObjectType names that should be part of the union, either
     * as string names or as references to the `objectType()` return value
     */
    members(...unionMembers) {
        this.typeBuilder.addUnionMembers(unionMembers);
    }
    /**
     * Sets the "resolveType" method for the current union
     */
    resolveType(fn) {
        this.typeBuilder.setResolveType(fn);
    }
}
exports.UnionDefinitionBlock = UnionDefinitionBlock;
class EngramUnionTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        graphql_1.assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
exports.EngramUnionTypeDef = EngramUnionTypeDef;
_types_1.withEngramSymbol(EngramUnionTypeDef, _types_1.EngramTypes.Union);
/**
 * Defines a new `GraphQLUnionType`
 * @param config
 */
function unionType(config) {
    return new EngramUnionTypeDef(config.name, config);
}
exports.unionType = unionType;
