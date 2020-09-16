"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngramSchemaExtension = exports.EngramInterfaceTypeExtension = exports.EngramObjectTypeExtension = exports.EngramInputObjectTypeExtension = exports.EngramFieldExtension = void 0;
/**
 * Container object living on `fieldDefinition.extensions.engram`
 */
class EngramFieldExtension {
    constructor(config) {
        const { resolve, ...rest } = config;
        this.config = rest;
        this.hasDefinedResolver = Boolean(resolve);
    }
}
exports.EngramFieldExtension = EngramFieldExtension;
/**
 * Container object living on `inputObjectType.extensions.engram`
 */
class EngramInputObjectTypeExtension {
    constructor(config) {
        const { definition, ...rest } = config;
        this.config = rest;
    }
}
exports.EngramInputObjectTypeExtension = EngramInputObjectTypeExtension;
/**
 * Container object living on `objectType.extensions.engram`
 */
class EngramObjectTypeExtension {
    constructor(config) {
        const { definition, ...rest } = config;
        this.config = rest;
    }
}
exports.EngramObjectTypeExtension = EngramObjectTypeExtension;
/**
 * Container object living on `interfaceType.extensions.engram`
 */
class EngramInterfaceTypeExtension {
    constructor(config) {
        const { definition, ...rest } = config;
        this.config = rest;
    }
}
exports.EngramInterfaceTypeExtension = EngramInterfaceTypeExtension;
/**
 * Container object living on `schema.extensions.engram`. Keeps track
 * of metadata from the builder so we can use it when we
 */
class EngramSchemaExtension {
    constructor(config) {
        this.config = config;
    }
}
exports.EngramSchemaExtension = EngramSchemaExtension;
