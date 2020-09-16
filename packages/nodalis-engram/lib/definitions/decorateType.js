"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateType = void 0;
function decorateType(type, config) {
    type.extensions = {
        ...type.extensions,
        engram: {
            asEngramMethod: config.asEngramMethod,
            rootTyping: config.rootTyping,
        },
    };
    return type;
}
exports.decorateType = decorateType;
