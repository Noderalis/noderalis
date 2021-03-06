"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDLConverter = exports.convertSDL = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("./utils");
function convertSDL(sdl, commonjs = false, json = JSON) {
    try {
        return new SDLConverter(sdl, commonjs, json).print();
    }
    catch (e) {
        return `Error Parsing SDL into Schema: ${e.stack}`;
    }
}
exports.convertSDL = convertSDL;
/**
 * Convert an existing SDL schema into a GraphQL Engram format
 */
class SDLConverter {
    constructor(sdl, commonjs = false, json = JSON) {
        this.commonjs = commonjs;
        this.json = json;
        this.usedImports = new Set();
        this.exports = new Set();
        this.export = commonjs === null || commonjs ? 'const ' : 'export const ';
        this.schema = graphql_1.buildSchema(sdl);
        this.groupedTypes = utils_1.groupTypes(this.schema);
    }
    print() {
        const body = [
            this.printObjectTypes(),
            this.printInterfaceTypes(),
            this.printInputObjectTypes(),
            this.printUnionTypes(),
            this.printEnumTypes(),
            this.printScalarTypes(),
            this.printExports(),
        ];
        return [this.printUsedImports()]
            .concat(body)
            .filter((f) => f)
            .join('\n\n');
    }
    printUsedImports() {
        if (this.commonjs) {
            return `const { ${Array.from(this.usedImports).join(', ')} } = require('@engram/schema');`;
        }
        return `import { ${Array.from(this.usedImports).join(', ')} } from '@engram/schema';`;
    }
    printObjectTypes() {
        if (this.groupedTypes.object.length > 0) {
            this.usedImports.add('objectType');
            return this.groupedTypes.object
                .map((t) => this.printObjectType(t))
                .join('\n');
        }
        return '';
    }
    printObjectType(type) {
        const implementing = type.getInterfaces().map((i) => i.name);
        const implementsInterfaces = implementing.length > 0
            ? `    t.implements(${implementing.join(', ')})`
            : '';
        this.exports.add(type.name);
        return this.printBlock([
            `${this.export}${type.name} = objectType({`,
            `  name: "${type.name}",`,
            this.maybeDescription(type),
            `  definition(t) {`,
            implementsInterfaces,
            this.printObjectFields(type),
            `  }`,
            `})`,
        ]);
    }
    printObjectFields(type) {
        return utils_1.objValues(type.getFields())
            .map((field) => {
            if (graphql_1.isObjectType(type) && utils_1.isInterfaceField(type, field.name)) {
                return;
            }
            return this.printField('output', field);
        })
            .filter((f) => f)
            .join('\n');
    }
    printInputObjectFields(type) {
        return utils_1.objValues(type.getFields())
            .map((field) => this.printField('input', field))
            .filter((f) => f)
            .join('\n');
    }
    printField(source, field) {
        const { list, type: fieldType, isNonNull } = utils_1.unwrapType(field.type);
        const prefix = list.length === 1 && list[0] === true ? `t.list.` : `t.`;
        return `    ${prefix}${this.printFieldMethod(source, field, fieldType, list, isNonNull)}`;
    }
    printFieldMethod(source, field, type, list, isNonNull) {
        const objectMeta = {};
        let str = '';
        if (isCommonScalar(type)) {
            str += `${type.name.toLowerCase()}("${field.name}"`;
        }
        else {
            objectMeta.type = type;
            str += `field("${field.name}"`;
        }
        if ('deprecationReason' in field && field.deprecationReason) {
            objectMeta.deprecation = field.deprecationReason;
        }
        if (list.length > 1 || list[0] === false) {
            objectMeta.list = list;
        }
        if (!isNonNull && source === 'output') {
            objectMeta.nullable = true;
        }
        else if (isNonNull && source === 'input') {
            objectMeta.required = true;
        }
        if (field.description) {
            objectMeta.description = field.description;
        }
        if (source === 'output') {
            const outputField = field;
            if (outputField.args.length) {
                objectMeta.args = outputField.args;
            }
        }
        else {
            const inputField = field;
            if (inputField.defaultValue !== undefined) {
                objectMeta.default = inputField.defaultValue;
            }
        }
        const metaKeys = Object.keys(objectMeta);
        if (metaKeys.length > 0) {
            if (metaKeys.length === 1 && !objectMeta.args) {
                const key = metaKeys[0];
                str += `, { ${key}: ${this.printMeta(objectMeta[key], key)} }`;
            }
            else {
                str += `, {\n`;
                utils_1.eachObj(objectMeta, (val, key) => {
                    str += `      ${key}: ${this.printMeta(val, key)},\n`;
                });
                str += `    }`;
            }
        }
        return `${str})`;
    }
    printMeta(val, key) {
        if (key === 'type') {
            return val;
        }
        if (key === 'list' || key === 'required') {
            return Array.isArray(val)
                ? `[${val.join(', ')}]`
                : this.json.stringify(val);
        }
        if (key === 'args') {
            let str = `{\n`;
            val.forEach((arg) => {
                str += `        ${arg.name}: ${this.printArg(arg)}\n`;
            });
            str += `      }`;
            return str;
        }
        return this.json.stringify(val);
    }
    printArg(arg) {
        const description = arg.description;
        const { list, isNonNull, type } = utils_1.unwrapType(arg.type);
        const isArg = !isCommonScalar(type);
        let str = '';
        if (isArg) {
            this.usedImports.add('arg');
            str += `arg(`;
        }
        else {
            this.usedImports.add(`${type.toString().toLowerCase()}Arg`);
            str += `${type.toString().toLowerCase()}Arg(`;
        }
        const metaToAdd = [];
        if (isArg) {
            metaToAdd.push(`type: ${type.name}`);
        }
        if (description) {
            metaToAdd.push(`description: ${JSON.stringify(description)}`);
        }
        if (list.length) {
            metaToAdd.push(list.length === 1 && list[0] === true
                ? `list: true`
                : `list: [${list.join(', ')}]`);
        }
        if (arg.defaultValue !== undefined) {
            metaToAdd.push(`default: ${this.json.stringify(arg.defaultValue)}`);
        }
        if (isNonNull) {
            metaToAdd.push('required: true');
        }
        str +=
            metaToAdd.length > 1
                ? `{\n          ${metaToAdd.join(',\n          ')}\n        }`
                : metaToAdd.length
                    ? `{ ${metaToAdd[0]} }`
                    : '';
        return `${str}),`;
    }
    printInterfaceTypes() {
        if (this.groupedTypes.interface.length) {
            this.usedImports.add('interfaceType');
            return this.groupedTypes.interface
                .map((t) => this.printInterfaceType(t))
                .join('\n');
        }
        return '';
    }
    printInterfaceType(type) {
        this.exports.add(type.name);
        return this.printBlock([
            `${this.export}${type.name} = interfaceType({`,
            `  name: "${type.name}",`,
            this.maybeDescription(type),
            `  definition(t) {`,
            this.printObjectFields(type),
            `    t.resolveType(() => null)`,
            `  }`,
            `});`,
        ]);
    }
    printEnumTypes() {
        if (this.groupedTypes.enum.length) {
            this.usedImports.add('enumType');
            return this.groupedTypes.enum
                .map((t) => this.printEnumType(t))
                .join('\n');
        }
        return '';
    }
    printEnumType(type) {
        const members = type.getValues().map((val) => {
            const { description, name, deprecationReason, value } = val;
            if (!description && !deprecationReason && name === value) {
                return val.name;
            }
            return { description, name, deprecation: deprecationReason, value };
        });
        this.exports.add(type.name);
        return this.printBlock([
            `${this.export}${type.name} = enumType({`,
            `  name: "${type.name}",`,
            this.maybeDescription(type),
            `  members: ${this.json.stringify(members)},`,
            `});`,
        ]);
    }
    printInputObjectTypes() {
        if (this.groupedTypes.input.length) {
            this.usedImports.add('inputObjectType');
            return this.groupedTypes.input
                .map((t) => this.printInputObjectType(t))
                .join('\n');
        }
        return '';
    }
    printInputObjectType(type) {
        this.exports.add(type.name);
        return this.printBlock([
            `${this.export}${type.name} = inputObjectType({`,
            `  name: "${type.name}",`,
            this.maybeDescription(type),
            `  definition(t) {`,
            this.printInputObjectFields(type),
            `  }`,
            `});`,
        ]);
    }
    printUnionTypes() {
        if (this.groupedTypes.union.length) {
            this.usedImports.add('unionType');
            return this.groupedTypes.union
                .map((t) => this.printUnionType(t))
                .join('\n');
        }
        return '';
    }
    printUnionType(type) {
        this.exports.add(type.name);
        return this.printBlock([
            `${this.export}${type.name} = unionType({`,
            `  name: "${type.name}",`,
            this.maybeDescription(type),
            `  definition(t) {`,
            `    t.members(${type.getTypes().join(', ')})`,
            `  }`,
            `});`,
        ]);
    }
    printScalarTypes() {
        if (this.groupedTypes.scalar.length) {
            this.usedImports.add('scalarType');
            return this.groupedTypes.scalar
                .filter((s) => !graphql_1.isSpecifiedScalarType(s))
                .map((t) => this.printScalarType(t))
                .join('\n');
        }
        return '';
    }
    printScalarType(type) {
        this.exports.add(type.name);
        return this.printBlock([
            `${this.export}${type.name} = scalarType({`,
            `  name: "${type.name}",`,
            this.maybeDescription(type),
            this.maybeAsEngramType(type),
            `  serialize() { /* Todo */ },`,
            `  parseValue() { /* Todo */ },`,
            `  parseLiteral() { /* Todo */ }`,
            `});`,
        ]);
    }
    printExports() {
        if (!this.commonjs || this.exports.size === 0) {
            return '';
        }
        const exports = Array.from(this.exports);
        return this.printBlock(exports.map((exp) => `exports.${exp} = ${exp};`));
    }
    maybeAsEngramType(type) {
        if (isCommonScalar(type)) {
            return `  asEngramMethod: "${type.name.toLowerCase()}",`;
        }
        return null;
    }
    maybeDescription(type) {
        if (type.description) {
            return `  description: ${this.json.stringify(type.description)},`;
        }
        return null;
    }
    printBlock(block) {
        return block.filter((t) => t !== null && t !== '').join('\n');
    }
}
exports.SDLConverter = SDLConverter;
function isCommonScalar(field) {
    if (graphql_1.isScalarType(field)) {
        return (field.name === 'UUID' ||
            field.name === 'Date' ||
            graphql_1.isSpecifiedScalarType(field));
    }
    return false;
}
