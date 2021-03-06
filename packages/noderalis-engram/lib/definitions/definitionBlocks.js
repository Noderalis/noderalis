"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDefinitionBlock = exports.OutputDefinitionBlock = void 0;
/**
 * The output definition block is passed to the "definition"
 * argument of the
 */
class OutputDefinitionBlock {
    constructor(typeBuilder, isList = false) {
        this.typeBuilder = typeBuilder;
        this.isList = isList;
        this.typeName = typeBuilder.typeName;
        this.typeBuilder.addDynamicOutputMembers(this, isList);
    }
    get list() {
        if (this.isList) {
            throw new Error('Cannot chain list.list, in the definition block. Use `list: []` config value');
        }
        return new OutputDefinitionBlock(this.typeBuilder, true);
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
        // FIXME
        // 1. FieldOutConfig<TypeName is constrained to any string subtype
        // 2. EngramOutputFieldDef is contrained to be be a string
        // 3. so `name` is not compatible
        // 4. and changing FieldOutConfig to FieldOutConfig<string breaks types in other places
        const field = { name, ...fieldConfig };
        this.typeBuilder.addField(this.decorateField(field));
    }
    addScalarField(fieldName, typeName, opts) {
        let config = {
            name: fieldName,
            type: typeName,
        };
        if (typeof opts[0] === 'function') {
            // FIXME ditto to the one in `field` method
            config.resolve = opts[0];
        }
        else {
            config = { ...config, ...opts[0] };
        }
        this.typeBuilder.addField(this.decorateField(config));
    }
    decorateField(config) {
        if (this.isList) {
            if (config.list) {
                this.typeBuilder.warn(`It looks like you chained .list and set list for ${config.name}. ` +
                    'You should only do one or the other');
            }
            else {
                config.list = true;
            }
        }
        return config;
    }
}
exports.OutputDefinitionBlock = OutputDefinitionBlock;
// export interface InputDefinitionBlock<TypeName extends string> extends EngramGenCustomInputMethods<TypeName> {}
class InputDefinitionBlock {
    constructor(typeBuilder, isList = false) {
        this.typeBuilder = typeBuilder;
        this.isList = isList;
        this.typeName = typeBuilder.typeName;
        this.typeBuilder.addDynamicInputFields(this, isList);
    }
    get list() {
        if (this.isList) {
            throw new Error('Cannot chain list.list, in the definition block. Use `list: []` config value');
        }
        return new InputDefinitionBlock(this.typeBuilder, true);
    }
    string(fieldName, opts) {
        this.addScalarField(fieldName, 'String', opts);
    }
    int(fieldName, opts) {
        this.addScalarField(fieldName, 'Int', opts);
    }
    boolean(fieldName, opts) {
        this.addScalarField(fieldName, 'Boolean', opts);
    }
    id(fieldName, opts) {
        this.addScalarField(fieldName, 'ID', opts);
    }
    float(fieldName, opts) {
        this.addScalarField(fieldName, 'Float', opts);
    }
    field(fieldName, fieldConfig) {
        this.typeBuilder.addField(this.decorateField({
            name: fieldName,
            ...fieldConfig,
        }));
    }
    addScalarField(fieldName, typeName, opts = {}) {
        this.typeBuilder.addField(this.decorateField({
            name: fieldName,
            type: typeName,
            ...opts,
        }));
    }
    decorateField(config) {
        if (this.isList) {
            if (config.list) {
                this.typeBuilder.warn(`It looks like you chained .list and set list for ${config.name}. ` +
                    'You should only do one or the other');
            }
            else {
                config.list = true;
            }
        }
        return config;
    }
}
exports.InputDefinitionBlock = InputDefinitionBlock;
