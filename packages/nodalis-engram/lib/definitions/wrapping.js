"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEngramPlugin = exports.isEngramPrintedGenTypingImport = exports.isEngramPrintedGenTyping = exports.isEngramDynamicInputMethod = exports.isEngramDynamicOutputMethod = exports.isEngramDynamicOutputProperty = exports.isEngramArgDef = exports.isEngramInterfaceTypeDef = exports.isEngramUnionTypeDef = exports.isEngramScalarTypeDef = exports.isEngramObjectTypeDef = exports.isEngramInputObjectTypeDef = exports.isEngramEnumTypeDef = exports.isEngramExtendTypeDef = exports.isEngramExtendInputTypeDef = exports.isEngramNamedTypeDef = exports.isEngramStruct = exports.isEngramTypeDef = void 0;
const _types_1 = require("./_types");
const NamedTypeDefs = new Set([
    _types_1.EngramTypes.Enum,
    _types_1.EngramTypes.Object,
    _types_1.EngramTypes.Scalar,
    _types_1.EngramTypes.Union,
    _types_1.EngramTypes.Interface,
    _types_1.EngramTypes.InputObject,
]);
exports.isEngramTypeDef = (obj) => {
    console.warn(`isEngramTypeDef is deprecated, use isEngramStruct`);
    return isEngramStruct(obj);
};
function isEngramStruct(obj) {
    return obj && Boolean(obj[_types_1.EngramWrappedSymbol]);
}
exports.isEngramStruct = isEngramStruct;
function isEngramNamedTypeDef(obj) {
    return isEngramStruct(obj) && NamedTypeDefs.has(obj[_types_1.EngramWrappedSymbol]);
}
exports.isEngramNamedTypeDef = isEngramNamedTypeDef;
function isEngramExtendInputTypeDef(obj) {
    return (isEngramStruct(obj) &&
        obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.ExtendInputObject);
}
exports.isEngramExtendInputTypeDef = isEngramExtendInputTypeDef;
function isEngramExtendTypeDef(obj) {
    return (isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.ExtendObject);
}
exports.isEngramExtendTypeDef = isEngramExtendTypeDef;
function isEngramEnumTypeDef(obj) {
    return isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Enum;
}
exports.isEngramEnumTypeDef = isEngramEnumTypeDef;
function isEngramInputObjectTypeDef(obj) {
    return (isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.InputObject);
}
exports.isEngramInputObjectTypeDef = isEngramInputObjectTypeDef;
function isEngramObjectTypeDef(obj) {
    return isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Object;
}
exports.isEngramObjectTypeDef = isEngramObjectTypeDef;
function isEngramScalarTypeDef(obj) {
    return isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Scalar;
}
exports.isEngramScalarTypeDef = isEngramScalarTypeDef;
function isEngramUnionTypeDef(obj) {
    return isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Union;
}
exports.isEngramUnionTypeDef = isEngramUnionTypeDef;
function isEngramInterfaceTypeDef(obj) {
    return (isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Interface);
}
exports.isEngramInterfaceTypeDef = isEngramInterfaceTypeDef;
function isEngramArgDef(obj) {
    return isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Arg;
}
exports.isEngramArgDef = isEngramArgDef;
function isEngramDynamicOutputProperty(obj) {
    return (isEngramStruct(obj) &&
        obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.DynamicOutputProperty);
}
exports.isEngramDynamicOutputProperty = isEngramDynamicOutputProperty;
function isEngramDynamicOutputMethod(obj) {
    return (isEngramStruct(obj) &&
        obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.DynamicOutputMethod);
}
exports.isEngramDynamicOutputMethod = isEngramDynamicOutputMethod;
function isEngramDynamicInputMethod(obj) {
    return (isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.DynamicInput);
}
exports.isEngramDynamicInputMethod = isEngramDynamicInputMethod;
function isEngramPrintedGenTyping(obj) {
    return (isEngramStruct(obj) &&
        obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.PrintedGenTyping);
}
exports.isEngramPrintedGenTyping = isEngramPrintedGenTyping;
function isEngramPrintedGenTypingImport(obj) {
    return (isEngramStruct(obj) &&
        obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.PrintedGenTypingImport);
}
exports.isEngramPrintedGenTypingImport = isEngramPrintedGenTypingImport;
function isEngramPlugin(obj) {
    return isEngramStruct(obj) && obj[_types_1.EngramWrappedSymbol] === _types_1.EngramTypes.Plugin;
}
exports.isEngramPlugin = isEngramPlugin;
