"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withEngramSymbol = exports.EngramWrappedSymbol = exports.EngramTypes = void 0;
var EngramTypes;
(function (EngramTypes) {
    EngramTypes["Arg"] = "Arg";
    EngramTypes["Enum"] = "Enum";
    EngramTypes["Object"] = "Object";
    EngramTypes["Interface"] = "Interface";
    EngramTypes["InputObject"] = "InputObject";
    EngramTypes["Scalar"] = "Scalar";
    EngramTypes["Union"] = "Union";
    EngramTypes["ExtendObject"] = "ExtendObject";
    EngramTypes["ExtendInputObject"] = "ExtendInputObject";
    EngramTypes["OutputField"] = "OutputField";
    EngramTypes["InputField"] = "InputField";
    EngramTypes["DynamicInput"] = "DynamicInput";
    EngramTypes["DynamicOutputMethod"] = "DynamicOutputMethod";
    EngramTypes["DynamicOutputProperty"] = "DynamicOutputProperty";
    EngramTypes["Plugin"] = "Plugin";
    EngramTypes["PrintedGenTyping"] = "PrintedGenTyping";
    EngramTypes["PrintedGenTypingImport"] = "PrintedGenTypingImport";
})(EngramTypes = exports.EngramTypes || (exports.EngramTypes = {}));
exports.EngramWrappedSymbol = Symbol.for('@engram/wrapped');
function withEngramSymbol(obj, engramType) {
    obj.prototype[exports.EngramWrappedSymbol] = engramType;
}
exports.withEngramSymbol = withEngramSymbol;
