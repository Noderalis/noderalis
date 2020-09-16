"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionType = exports.SubscriptionDefinitionBlock = void 0;
const objectType_1 = require("./objectType");
class SubscriptionDefinitionBlock extends objectType_1.ObjectDefinitionBlock {
    constructor(typeBuilder, isList = false) {
        super(typeBuilder);
        this.typeBuilder = typeBuilder;
        this.isList = isList;
    }
    get list() {
        if (this.isList) {
            throw new Error('Cannot chain list.list, in the definition block. Use `list: []` config value');
        }
        return new SubscriptionDefinitionBlock(this.typeBuilder, true);
    }
    string(fieldName, ...opts) {
        this.addScalarField(fieldName, 'String', opts);
    }
    int(fieldName, ...opts) {
        this.addScalarField(fieldName, 'Int', opts);
    }
    boolean(fieldName, ...opts) {
        this.addScalarField(fieldName, 'Boolean', opts);
    }
    id(fieldName, ...opts) {
        this.addScalarField(fieldName, 'ID', opts);
    }
    float(fieldName, ...opts) {
        this.addScalarField(fieldName, 'Float', opts);
    }
    field(name, fieldConfig) {
        const field = { name, ...fieldConfig };
        this.typeBuilder.addField(this.decorateField(field));
    }
}
exports.SubscriptionDefinitionBlock = SubscriptionDefinitionBlock;
function subscriptionType(config) {
    return objectType_1.objectType({ name: 'Subscription', ...config });
}
exports.subscriptionType = subscriptionType;
