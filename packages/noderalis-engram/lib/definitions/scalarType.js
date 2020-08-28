"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asEngramMethod = exports.scalarType = exports.EngramScalarTypeDef = void 0;
const graphql_1 = require("graphql");
const decorateType_1 = require("./decorateType");
const _types_1 = require("./_types");
class EngramScalarTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        graphql_1.assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
exports.EngramScalarTypeDef = EngramScalarTypeDef;
_types_1.withEngramSymbol(EngramScalarTypeDef, _types_1.EngramTypes.Scalar);
function scalarType(options) {
    return new EngramScalarTypeDef(options.name, options);
}
exports.scalarType = scalarType;
function asEngramMethod(scalar, methodName, rootTyping) {
    return decorateType_1.decorateType(scalar, {
        asEngramMethod: methodName,
        rootTyping: rootTyping,
    });
}
exports.asEngramMethod = asEngramMethod;
