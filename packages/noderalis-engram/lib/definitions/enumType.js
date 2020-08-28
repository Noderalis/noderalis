"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumType = exports.EngramEnumTypeDef = void 0;
const graphql_1 = require("graphql");
const _types_1 = require("./_types");
class EngramEnumTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        graphql_1.assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
exports.EngramEnumTypeDef = EngramEnumTypeDef;
_types_1.withEngramSymbol(EngramEnumTypeDef, _types_1.EngramTypes.Enum);
function enumType(config) {
    return new EngramEnumTypeDef(config.name, config);
}
exports.enumType = enumType;
