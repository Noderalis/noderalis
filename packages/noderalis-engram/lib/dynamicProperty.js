"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicOutputProperty = exports.DynamicOutputPropertyDef = void 0;
const _types_1 = require("./definitions/_types");
class DynamicOutputPropertyDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
    }
    get value() {
        return this.config;
    }
}
exports.DynamicOutputPropertyDef = DynamicOutputPropertyDef;
_types_1.withEngramSymbol(DynamicOutputPropertyDef, _types_1.EngramTypes.DynamicOutputProperty);
/**
 * Defines a new property on the object definition block
 * for an output type, making it possible to build custom DSL's
 * on top of Engram, e.g. in engram-prisma
 *
 * t.model.posts()
 */
function dynamicOutputProperty(config) {
    return new DynamicOutputPropertyDef(config.name, config);
}
exports.dynamicOutputProperty = dynamicOutputProperty;
