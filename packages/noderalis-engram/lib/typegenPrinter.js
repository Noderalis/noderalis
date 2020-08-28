"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypegenPrinter = void 0;
const graphql_1 = require("graphql");
const path_1 = __importDefault(require("path"));
const wrapping_1 = require("./definitions/wrapping");
const utils_1 = require("./utils");
const SpecifiedScalars = {
    ID: 'string',
    String: 'string',
    Float: 'number',
    Int: 'number',
    Boolean: 'boolean',
};
/**
 * We track and output a few main things:
 *
 * 1. "root" types, or the values that fill the first
 *    argument for a given object type
 *
 * 2. "arg" types, the values that are arguments to output fields.
 *
 * 3. "return" types, the values returned from the resolvers... usually
 *    just list/nullable variations on the "root" types for other types
 *
 * 4. The names of all types, grouped by type.
 *
 * - Non-scalar types will get a dedicated "Root" type associated with it
 */
class TypegenPrinter {
    constructor(schema, typegenInfo) {
        this.schema = schema;
        this.typegenInfo = typegenInfo;
        this.printObj = (space, source) => (val, key) => {
            return [`${space}${key}: { // ${source}`]
                .concat(utils_1.mapObj(val, (v2, k2) => {
                return `${space}  ${k2}${v2[0]} ${v2[1]}`;
            }))
                .concat(`${space}}`)
                .join('\n');
        };
        this.groupedTypes = utils_1.groupTypes(schema);
        this.printImports = {};
    }
    print() {
        const body = [
            this.printInputTypeMap(),
            this.printEnumTypeMap(),
            this.printScalarTypeMap(),
            this.printRootTypeMap(),
            this.printAllTypesMap(),
            this.printReturnTypeMap(),
            this.printArgTypeMap(),
            this.printAbstractResolveReturnTypeMap(),
            this.printInheritedFieldMap(),
            this.printTypeNames('object', 'EngramGenObjectNames'),
            this.printTypeNames('input', 'EngramGenInputNames'),
            this.printTypeNames('enum', 'EngramGenEnumNames'),
            this.printTypeNames('interface', 'EngramGenInterfaceNames'),
            this.printTypeNames('scalar', 'EngramGenScalarNames'),
            this.printTypeNames('union', 'EngramGenUnionNames'),
            this.printGenTypeMap(),
            this.printPlugins(),
        ].join('\n\n');
        return [this.printHeaders(), body].join('\n\n');
    }
    printHeaders() {
        const fieldDefs = [
            this.printDynamicInputFieldDefinitions(),
            this.printDynamicOutputFieldDefinitions(),
            this.printDynamicOutputPropertyDefinitions(),
        ];
        return [
            this.typegenInfo.headers.join('\n'),
            this.typegenInfo.imports.join('\n'),
            this.printDynamicImport(),
            ...fieldDefs,
            GLOBAL_DECLARATION,
        ].join('\n');
    }
    printGenTypeMap() {
        return [`export interface EngramGenTypes {`]
            .concat([
            `  context: ${this.printContext()};`,
            `  inputTypes: EngramGenInputs;`,
            `  rootTypes: EngramGenRootTypes;`,
            `  argTypes: EngramGenArgTypes;`,
            `  fieldTypes: EngramGenFieldTypes;`,
            `  allTypes: EngramGenAllTypes;`,
            `  inheritedFields: EngramGenInheritedFields;`,
            `  objectNames: EngramGenObjectNames;`,
            `  inputNames: EngramGenInputNames;`,
            `  enumNames: EngramGenEnumNames;`,
            `  interfaceNames: EngramGenInterfaceNames;`,
            `  scalarNames: EngramGenScalarNames;`,
            `  unionNames: EngramGenUnionNames;`,
            `  allInputTypes: EngramGenTypes['inputNames'] | EngramGenTypes['enumNames'] | EngramGenTypes['scalarNames'];`,
            `  allOutputTypes: EngramGenTypes['objectNames'] | EngramGenTypes['enumNames'] | EngramGenTypes['unionNames'] | EngramGenTypes['interfaceNames'] | EngramGenTypes['scalarNames'];`,
            `  allNamedTypes: EngramGenTypes['allInputTypes'] | EngramGenTypes['allOutputTypes']`,
            `  abstractTypes: EngramGenTypes['interfaceNames'] | EngramGenTypes['unionNames'];`,
            `  abstractResolveReturn: EngramGenAbstractResolveReturnTypes;`,
        ])
            .concat('}')
            .join('\n');
    }
    printDynamicImport() {
        var _a;
        const { rootTypings, dynamicFields: { dynamicInputFields, dynamicOutputFields }, } = this.schema.extensions.engram.config;
        const imports = [];
        const importMap = {};
        const outputPath = this.typegenInfo.typegenFile;
        const engramSchemaImportId = (_a = this.typegenInfo.engramSchemaImportId) !== null && _a !== void 0 ? _a : utils_1.getOwnPackage().name;
        if (!this.printImports[engramSchemaImportId]) {
            if ([dynamicInputFields, dynamicOutputFields].some((o) => Object.keys(o).length > 0)) {
                this.printImports[engramSchemaImportId] = {
                    core: true,
                };
            }
        }
        utils_1.eachObj(rootTypings, (val, key) => {
            if (typeof val !== 'string') {
                const importPath = (path_1.default.isAbsolute(val.path)
                    ? utils_1.relativePathTo(val.path, outputPath)
                    : val.path)
                    .replace(/(\.d)?\.ts/, '')
                    .replace(/\\+/g, '/');
                importMap[importPath] = importMap[importPath] || new Set();
                importMap[importPath].add(val.alias ? `${val.name} as ${val.alias}` : val.name);
            }
        });
        utils_1.eachObj(importMap, (val, key) => {
            imports.push(`import { ${Array.from(val).join(', ')} } from ${JSON.stringify(key)}`);
        });
        utils_1.eachObj(this.printImports, (val, key) => {
            const { default: def, ...rest } = val;
            const idents = [];
            if (def) {
                idents.push(def);
            }
            let bindings = [];
            utils_1.eachObj(rest, (alias, binding) => {
                bindings.push(alias !== true ? `${binding} as ${alias}` : `${binding}`);
            });
            if (bindings.length) {
                idents.push(`{ ${bindings.join(', ')} }`);
            }
            imports.push(`import ${idents.join(', ')} from ${JSON.stringify(key)}`);
        });
        return imports.join('\n');
    }
    printDynamicInputFieldDefinitions() {
        const { dynamicInputFields, } = this.schema.extensions.engram.config.dynamicFields;
        // If there is nothing custom... exit
        if (!Object.keys(dynamicInputFields).length) {
            return [];
        }
        return [
            `declare global {`,
            `  interface EngramGenCustomInputMethods<TypeName extends string> {`,
        ]
            .concat(utils_1.mapObj(dynamicInputFields, (val, key) => {
            if (typeof val === 'string') {
                return `    ${key}<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // ${JSON.stringify(val)};`;
            }
            return `    ${key}${val.value.typeDefinition || `(...args: any): void`}`;
        }))
            .concat([`  }`, `}`])
            .join('\n');
    }
    printDynamicOutputFieldDefinitions() {
        const { dynamicOutputFields, } = this.schema.extensions.engram.config.dynamicFields;
        // If there is nothing custom... exit
        if (!Object.keys(dynamicOutputFields).length) {
            return [];
        }
        return [
            `declare global {`,
            `  interface EngramGenCustomOutputMethods<TypeName extends string> {`,
        ]
            .concat(utils_1.mapObj(dynamicOutputFields, (val, key) => {
            if (typeof val === 'string') {
                return `    ${key}<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // ${JSON.stringify(val)};`;
            }
            return `    ${key}${val.value.typeDefinition || `(...args: any): void`}`;
        }))
            .concat([`  }`, `}`])
            .join('\n');
    }
    printDynamicOutputPropertyDefinitions() {
        const { dynamicOutputProperties, } = this.schema.extensions.engram.config.dynamicFields;
        // If there is nothing custom... exit
        if (!Object.keys(dynamicOutputProperties).length) {
            return [];
        }
        return [
            `declare global {`,
            `  interface EngramGenCustomOutputProperties<TypeName extends string> {`,
        ]
            .concat(utils_1.mapObj(dynamicOutputProperties, (val, key) => {
            return `    ${key}${val.value.typeDefinition || `: any`}`;
        }))
            .concat([`  }`, `}`])
            .join('\n');
    }
    printInheritedFieldMap() {
        // TODO:
        return 'export interface EngramGenInheritedFields {}';
    }
    printContext() {
        return this.typegenInfo.contextType || '{}';
    }
    buildResolveSourceTypeMap() {
        const sourceMap = {};
        const abstractTypes = [];
        abstractTypes
            .concat(this.groupedTypes.union)
            .concat(this.groupedTypes.interface)
            .forEach((type) => {
            if (graphql_1.isInterfaceType(type)) {
                const possibleNames = this.schema
                    .getPossibleTypes(type)
                    .map((t) => t.name);
                if (possibleNames.length > 0) {
                    sourceMap[type.name] = possibleNames
                        .map((val) => `EngramGenRootTypes['${val}']`)
                        .join(' | ');
                }
            }
            else {
                sourceMap[type.name] = type
                    .getTypes()
                    .map((t) => `EngramGenRootTypes['${t.name}']`)
                    .join(' | ');
            }
        });
        return sourceMap;
    }
    printAbstractResolveReturnTypeMap() {
        return this.printTypeInterface('EngramGenAbstractResolveReturnTypes', this.buildResolveReturnTypesMap());
    }
    buildResolveReturnTypesMap() {
        const sourceMap = {};
        const abstractTypes = [];
        abstractTypes
            .concat(this.groupedTypes.union)
            .concat(this.groupedTypes.interface)
            .forEach((type) => {
            if (graphql_1.isInterfaceType(type)) {
                const possibleNames = this.schema
                    .getPossibleTypes(type)
                    .map((t) => t.name);
                if (possibleNames.length > 0) {
                    sourceMap[type.name] = possibleNames
                        .map((val) => JSON.stringify(val))
                        .join(' | ');
                }
            }
            else {
                sourceMap[type.name] = type
                    .getTypes()
                    .map((t) => JSON.stringify(t.name))
                    .join(' | ');
            }
        });
        return sourceMap;
    }
    printTypeNames(name, exportName) {
        const obj = this.groupedTypes[name];
        const typeDef = obj.length === 0
            ? 'never'
            : obj
                .map((o) => JSON.stringify(o.name))
                .sort()
                .join(' | ');
        return `export type ${exportName} = ${typeDef};`;
    }
    buildEnumTypeMap() {
        const enumMap = {};
        this.groupedTypes.enum.forEach((e) => {
            const backingType = this.resolveBackingType(e.name);
            if (backingType) {
                enumMap[e.name] = backingType;
            }
            else {
                const values = e.getValues().map((val) => JSON.stringify(val.value));
                enumMap[e.name] = values.join(' | ');
            }
        });
        return enumMap;
    }
    buildInputTypeMap() {
        const inputObjMap = {};
        this.groupedTypes.input.forEach((input) => {
            utils_1.eachObj(input.getFields(), (field) => {
                inputObjMap[input.name] = inputObjMap[input.name] || {};
                inputObjMap[input.name][field.name] = this.normalizeArg(field);
            });
        });
        return inputObjMap;
    }
    buildScalarTypeMap() {
        const scalarMap = {};
        this.groupedTypes.scalar.forEach((e) => {
            if (graphql_1.isSpecifiedScalarType(e)) {
                scalarMap[e.name] = SpecifiedScalars[e.name];
                return;
            }
            const backingType = this.resolveBackingType(e.name);
            if (backingType) {
                scalarMap[e.name] = backingType;
            }
            else {
                scalarMap[e.name] = 'any';
            }
        });
        return scalarMap;
    }
    printInputTypeMap() {
        return this.printTypeFieldInterface('EngramGenInputs', this.buildInputTypeMap(), 'input type');
    }
    printEnumTypeMap() {
        return this.printTypeInterface('EngramGenEnums', this.buildEnumTypeMap());
    }
    printScalarTypeMap() {
        return this.printTypeInterface('EngramGenScalars', this.buildScalarTypeMap());
    }
    buildRootTypeMap() {
        const rootTypeMap = {};
        const hasFields = [];
        hasFields
            .concat(this.groupedTypes.object)
            .concat(this.groupedTypes.interface)
            .concat(this.groupedTypes.union)
            .forEach((type) => {
            const rootTyping = this.resolveBackingType(type.name);
            if (rootTyping) {
                rootTypeMap[type.name] = rootTyping;
                return;
            }
            if (graphql_1.isUnionType(type)) {
                rootTypeMap[type.name] = type
                    .getTypes()
                    .map((t) => `EngramGenRootTypes['${t.name}']`)
                    .join(' | ');
            }
            else if (graphql_1.isInterfaceType(type)) {
                const possibleRoots = this.schema
                    .getPossibleTypes(type)
                    .map((t) => `EngramGenRootTypes['${t.name}']`);
                if (possibleRoots.length > 0) {
                    rootTypeMap[type.name] = possibleRoots.join(' | ');
                }
                else {
                    rootTypeMap[type.name] = 'any';
                }
            }
            else if (type.name === 'Query' || type.name === 'Mutation') {
                rootTypeMap[type.name] = '{}';
            }
            else {
                utils_1.eachObj(type.getFields(), (field) => {
                    const obj = (rootTypeMap[type.name] = rootTypeMap[type.name] || {});
                    if (!this.hasResolver(field, type)) {
                        if (typeof obj !== 'string') {
                            obj[field.name] = [
                                this.argSeparator(field.type),
                                this.printOutputType(field.type),
                            ];
                        }
                    }
                });
            }
        });
        return rootTypeMap;
    }
    resolveBackingType(typeName) {
        const rootTyping = this.schema.extensions.engram.config.rootTypings[typeName];
        if (rootTyping) {
            return typeof rootTyping === 'string' ? rootTyping : rootTyping.name;
        }
        return this.typegenInfo.backingTypeMap[typeName];
    }
    buildAllTypesMap() {
        const typeMap = {};
        const toCheck = [];
        toCheck
            .concat(this.groupedTypes.input)
            .concat(this.groupedTypes.enum)
            .concat(this.groupedTypes.scalar)
            .forEach((type) => {
            if (graphql_1.isInputObjectType(type)) {
                typeMap[type.name] = `EngramGenInputs['${type.name}']`;
            }
            else if (graphql_1.isEnumType(type)) {
                typeMap[type.name] = `EngramGenEnums['${type.name}']`;
            }
            else if (graphql_1.isScalarType(type)) {
                typeMap[type.name] = `EngramGenScalars['${type.name}']`;
            }
        });
        return typeMap;
    }
    hasResolver(field, 
    // Used in test mocking
    _type) {
        if (field.extensions && field.extensions.engram) {
            return field.extensions.engram.hasDefinedResolver;
        }
        return Boolean(field.resolve);
    }
    printRootTypeMap() {
        return this.printRootTypeFieldInterface('EngramGenRootTypes', this.buildRootTypeMap());
    }
    printAllTypesMap() {
        const typeMapping = this.buildAllTypesMap();
        return [`export interface EngramGenAllTypes extends EngramGenRootTypes {`]
            .concat(utils_1.mapObj(typeMapping, (val, key) => {
            return `  ${key}: ${val};`;
        }))
            .concat('}')
            .join('\n');
    }
    buildArgTypeMap() {
        const argTypeMap = {};
        const hasFields = [];
        hasFields
            .concat(this.groupedTypes.object)
            .concat(this.groupedTypes.interface)
            .forEach((type) => {
            utils_1.eachObj(type.getFields(), (field) => {
                if (field.args.length > 0) {
                    argTypeMap[type.name] = argTypeMap[type.name] || {};
                    argTypeMap[type.name][field.name] = field.args.reduce((obj, arg) => {
                        obj[arg.name] = this.normalizeArg(arg);
                        return obj;
                    }, {});
                }
            });
        });
        return argTypeMap;
    }
    printArgTypeMap() {
        return this.printArgTypeFieldInterface(this.buildArgTypeMap());
    }
    buildReturnTypeMap() {
        const returnTypeMap = {};
        const hasFields = [];
        hasFields
            .concat(this.groupedTypes.object)
            .concat(this.groupedTypes.interface)
            .forEach((type) => {
            utils_1.eachObj(type.getFields(), (field) => {
                returnTypeMap[type.name] = returnTypeMap[type.name] || {};
                returnTypeMap[type.name][field.name] = [
                    ':',
                    this.printOutputType(field.type),
                ];
            });
        });
        return returnTypeMap;
    }
    printOutputType(type) {
        const returnType = this.typeToArr(type);
        function combine(item) {
            if (item.length === 1) {
                if (Array.isArray(item[0])) {
                    const toPrint = combine(item[0]);
                    return toPrint.indexOf('null') === -1
                        ? `${toPrint}[]`
                        : `Array<${toPrint}>`;
                }
                return item[0];
            }
            if (Array.isArray(item[1])) {
                const toPrint = combine(item[1]);
                return toPrint.indexOf('null') === -1
                    ? `${toPrint}[] | null`
                    : `Array<${toPrint}> | null`;
            }
            return `${item[1]} | null`;
        }
        return `${combine(returnType)}; // ${type}`;
    }
    typeToArr(type) {
        const typing = [];
        if (graphql_1.isNonNullType(type)) {
            type = type.ofType;
        }
        else {
            typing.push(null);
        }
        if (graphql_1.isListType(type)) {
            typing.push(this.typeToArr(type.ofType));
        }
        else if (graphql_1.isScalarType(type)) {
            typing.push(this.printScalar(type));
        }
        else if (graphql_1.isEnumType(type)) {
            typing.push(`EngramGenEnums['${type.name}']`);
        }
        else if (graphql_1.isObjectType(type) ||
            graphql_1.isInterfaceType(type) ||
            graphql_1.isUnionType(type)) {
            typing.push(`EngramGenRootTypes['${type.name}']`);
        }
        return typing;
    }
    printReturnTypeMap() {
        return this.printTypeFieldInterface('EngramGenFieldTypes', this.buildReturnTypeMap(), 'field return type');
    }
    normalizeArg(arg) {
        return [this.argSeparator(arg.type), this.argTypeRepresentation(arg.type)];
    }
    argSeparator(type) {
        if (graphql_1.isNonNullType(type)) {
            return ':';
        }
        return '?:';
    }
    argTypeRepresentation(arg) {
        const argType = this.argTypeArr(arg);
        function combine(item) {
            if (item.length === 1) {
                if (Array.isArray(item[0])) {
                    const toPrint = combine(item[0]);
                    return toPrint.indexOf('null') === -1
                        ? `${toPrint}[]`
                        : `Array<${toPrint}>`;
                }
                return item[0];
            }
            if (Array.isArray(item[1])) {
                const toPrint = combine(item[1]);
                return toPrint.indexOf('null') === -1
                    ? `${toPrint}[] | null`
                    : `Array<${toPrint}> | null`;
            }
            return `${item[1]} | null`;
        }
        return `${combine(argType)}; // ${arg}`;
    }
    argTypeArr(arg) {
        const typing = [];
        if (graphql_1.isNonNullType(arg)) {
            arg = arg.ofType;
        }
        else {
            typing.push(null);
        }
        if (graphql_1.isListType(arg)) {
            typing.push(this.argTypeArr(arg.ofType));
        }
        else if (graphql_1.isScalarType(arg)) {
            typing.push(this.printScalar(arg));
        }
        else if (graphql_1.isEnumType(arg)) {
            typing.push(`EngramGenEnums['${arg.name}']`);
        }
        else if (graphql_1.isInputObjectType(arg)) {
            typing.push(`EngramGenInputs['${arg.name}']`);
        }
        return typing;
    }
    printTypeInterface(interfaceName, typeMapping) {
        return [`export interface ${interfaceName} {`]
            .concat(utils_1.mapObj(typeMapping, (val, key) => `  ${key}: ${val}`))
            .concat('}')
            .join('\n');
    }
    printRootTypeFieldInterface(interfaceName, typeMapping) {
        return [`export interface ${interfaceName} {`]
            .concat(utils_1.mapObj(typeMapping, (val, key) => {
            if (typeof val === 'string') {
                return `  ${key}: ${val};`;
            }
            if (Object.keys(val).length === 0) {
                return `  ${key}: {};`;
            }
            return this.printObj('  ', 'root type')(val, key);
        }))
            .concat('}')
            .join('\n');
    }
    printTypeFieldInterface(interfaceName, typeMapping, source) {
        return [`export interface ${interfaceName} {`]
            .concat(utils_1.mapObj(typeMapping, this.printObj('  ', source)))
            .concat('}')
            .join('\n');
    }
    printArgTypeFieldInterface(typeMapping) {
        return [`export interface EngramGenArgTypes {`]
            .concat(utils_1.mapObj(typeMapping, (val, key) => {
            return [`  ${key}: {`]
                .concat(utils_1.mapObj(val, this.printObj('    ', 'args')))
                .concat('  }')
                .join('\n');
        }))
            .concat('}')
            .join('\n');
    }
    printScalar(type) {
        if (graphql_1.isSpecifiedScalarType(type)) {
            return SpecifiedScalars[type.name];
        }
        return `EngramGenScalars['${type.name}']`;
    }
    printPlugins() {
        const pluginFieldExt = [
            `  interface EngramGenPluginFieldConfig<TypeName extends string, FieldName extends string> {`,
        ];
        const pluginSchemaExt = [
            `  interface EngramGenPluginSchemaConfig {`,
        ];
        const pluginTypeExt = [
            `  interface EngramGenPluginTypeConfig<TypeName extends string> {`,
        ];
        const printInlineDefs = [];
        const plugins = this.schema.extensions.engram.config.plugins || [];
        plugins.forEach((plugin) => {
            if (plugin.config.fieldDefTypes) {
                pluginFieldExt.push(padLeft(this.printType(plugin.config.fieldDefTypes), '    '));
            }
            if (plugin.config.objectTypeDefTypes) {
                pluginTypeExt.push(padLeft(this.printType(plugin.config.objectTypeDefTypes), '    '));
            }
        });
        return [
            printInlineDefs.join('\n'),
            [
                'declare global {',
                [
                    pluginTypeExt.concat('  }').join('\n'),
                    pluginFieldExt.concat('  }').join('\n'),
                    pluginSchemaExt.concat('  }').join('\n'),
                ].join('\n'),
                '}',
            ].join('\n'),
        ].join('\n');
    }
    printType(strLike) {
        if (Array.isArray(strLike)) {
            return strLike.map((s) => this.printType(s)).join('\n');
        }
        if (wrapping_1.isEngramPrintedGenTyping(strLike)) {
            strLike.imports.forEach((i) => {
                this.addImport(i);
            });
            return strLike.toString();
        }
        if (wrapping_1.isEngramPrintedGenTypingImport(strLike)) {
            this.addImport(strLike);
            return '';
        }
        return strLike;
    }
    addImport(i) {
        /* istanbul ignore if */
        if (!wrapping_1.isEngramPrintedGenTypingImport(i)) {
            console.warn(`Expected printedGenTypingImport, saw ${i}`);
            return;
        }
        this.printImports[i.config.module] =
            this.printImports[i.config.module] || {};
        if (i.config.default) {
            this.printImports[i.config.module].default = i.config.default;
        }
        if (i.config.bindings) {
            i.config.bindings.forEach((binding) => {
                if (typeof binding === 'string') {
                    this.printImports[i.config.module][binding] = true;
                }
                else {
                    this.printImports[i.config.module][binding[0]] = binding[1];
                }
            });
        }
    }
}
exports.TypegenPrinter = TypegenPrinter;
function padLeft(str, padding) {
    return str
        .split('\n')
        .map((s) => `${padding}${s}`)
        .join('\n');
}
const GLOBAL_DECLARATION = `
declare global {
  interface EngramGen extends EngramGenTypes {}
}`;
