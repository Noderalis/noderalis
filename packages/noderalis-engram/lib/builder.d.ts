import { GraphQLEnumType, GraphQLField, GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLFieldConfigMap, GraphQLFieldResolver, GraphQLInputFieldConfig, GraphQLInputFieldConfigMap, GraphQLInputObjectType, GraphQLInputType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLOutputType, GraphQLScalarType, GraphQLSchema, GraphQLType, GraphQLUnionType, printSchema } from 'graphql';
import { ArgsRecord, EngramArgConfig } from './definitions/args';
import { InputDefinitionBlock, EngramInputFieldDef, EngramOutputFieldDef, OutputDefinitionBlock } from './definitions/definitionBlocks';
import { EnumTypeConfig } from './definitions/enumType';
import { EngramExtendInputTypeConfig, EngramExtendInputTypeDef } from './definitions/extendInputType';
import { EngramExtendTypeConfig, EngramExtendTypeDef } from './definitions/extendType';
import { EngramInputObjectTypeConfig } from './definitions/inputObjectType';
import { EngramInterfaceTypeConfig, EngramInterfaceTypeDef } from './definitions/interfaceType';
import { EngramObjectTypeConfig, EngramObjectTypeDef, ObjectDefinitionBlock } from './definitions/objectType';
import { EngramScalarTypeConfig } from './definitions/scalarType';
import { EngramUnionTypeConfig, UnionMembers } from './definitions/unionType';
import { AllEngramInputTypeDefs, AllEngramNamedTypeDefs, AllEngramOutputTypeDefs } from './definitions/wrapping';
import { GraphQLPossibleInputs, GraphQLPossibleOutputs, MissingType, EngramGraphQLInputObjectTypeConfig, EngramGraphQLInterfaceTypeConfig, EngramGraphQLObjectTypeConfig, EngramGraphQLSchema, NonNullConfig, RootTypings } from './definitions/_types';
import { DynamicInputMethodDef, DynamicOutputMethodDef } from './dynamicMethod';
import { DynamicOutputPropertyDef } from './dynamicProperty';
import { EngramSchemaExtension } from './extensions';
import { CreateFieldResolverInfo, EngramPlugin, PluginConfig } from './plugin';
import { TypegenAutoConfigOptions } from './typegenAutoConfig';
import { TypegenFormatFn } from './typegenFormatPrettier';
import { GetGen } from './typegenTypeHelpers';
declare type EngramShapedOutput = {
    name: string;
    definition: (t: ObjectDefinitionBlock<string>) => void;
};
declare type EngramShapedInput = {
    name: string;
    definition: (t: InputDefinitionBlock<string>) => void;
};
export interface BuilderConfig {
    /**
     * Generated artifact settings. Set to false to disable all.
     * Set to true to enable all and use default paths. Leave
     * undefined for default behavior of each artifact.
     */
    outputs?: boolean | {
        /**
         * TypeScript declaration file generation settings. This file
         * contains types reflected off your source code. It is how
         * Engram imbues dynamic code with static guarantees.
         *
         * Defaults to being enabled when `process.env.NODE_ENV !== "production"`.
         * Set to true to enable and emit into default path (see below).
         * Set to false to disable. Set to a string to specify absolute path.
         *
         * The default path is node_modules/@types/engram-typegen/index.d.ts.
         * This is chosen because TypeScript will pick it up without
         * any configuration needed by you. For more details about the @types
         * system refer to https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types
         */
        typegen?: boolean | string;
        /**
         * GraphQL SDL generation settings. This file is not necessary but
         * may be nice for teams wishing to review SDL in pull-requests or
         * just generally transitioning from a schema-first workflow.
         *
         * Defaults to false (disabled). Set to true to enable and emit into
         * default path (current working directory). Set to a string to specify
         * absolute path.
         */
        schema?: boolean | string;
    };
    /**
     * Whether the schema & types are generated when the server
     * starts. Default is !process.env.NODE_ENV || process.env.NODE_ENV === "development"
     */
    shouldGenerateArtifacts?: boolean;
    /**
     * Automatically configure type resolution for the TypeScript
     * representations of the associated types.
     *
     * Alias for typegenConfig: typegenAutoConfig(options)
     */
    typegenAutoConfig?: TypegenAutoConfigOptions;
    /**
     * A configuration function for advanced cases where
     * more control over the `TypegenInfo` is needed.
     */
    typegenConfig?: (schema: GraphQLSchema, outputPath: string) => TypegenInfo | PromiseLike<TypegenInfo>;
    /**
     * Adjust the Prettier options used while running prettier over
     * the generated output.
     *
     * Can be an absolute path to a Prettier config file like
     * .prettierrc or package.json with "prettier" field, or an object
     * of Prettier options.
     *
     * If provided, you must have prettier available as an importable dep
     * in your project.
     *
     */
    prettierConfig?: string | object;
    /**
     * Manually apply a formatter to the generated content before saving,
     * see the `prettierConfig` option if you want to use Prettier.
     */
    formatTypegen?: TypegenFormatFn;
    /**
     * Configures the default "nonNullDefaults" for the entire schema the type.
     * Read more about how engram handles nullability
     */
    nonNullDefaults?: NonNullConfig;
    /**
     * List of plugins to apply to Engram, with before/after hooks
     * executed first to last: before -> resolve -> after
     */
    plugins?: EngramPlugin[];
    /**
     * Provide if you wish to customize the behavior of the schema printing.
     * Otherwise, uses `printSchema` from graphql-js
     */
    customPrintSchemaFn?: typeof printSchema;
}
export declare type SchemaConfig = BuilderConfig & {
    /**
     * All of the GraphQL types. This is an any for simplicity of developer experience,
     * if it's an object we get the values, if it's an array we flatten out the
     * valid types, ignoring invalid ones.
     */
    types: any;
    /**
     * Whether we should process.exit after the artifacts are generated.
     * Useful if you wish to explicitly generate the test artifacts at a certain stage in
     * a startup or build process.
     * @default false
     */
    shouldExitAfterGenerateArtifacts?: boolean;
} & EngramGenPluginSchemaConfig;
export interface TypegenInfo {
    /**
     * Headers attached to the generate type output
     */
    headers: string[];
    /**
     * All imports for the backing types / context
     */
    imports: string[];
    /**
     * A map of all GraphQL types and what TypeScript types they should
     * be represented by.
     */
    backingTypeMap: {
        [K in GetGen<'objectNames'>]?: string;
    };
    /**
     * The type of the context for the resolvers
     */
    contextType?: string;
    /**
     * The path to the @engram/schema package.
     *
     * @default '@engram/schema'
     *
     * @remarks
     *
     * This setting is particularly useful when @engram/schema is being wrapped by
     * another library/framework such that @engram/schema is not expected to be a
     * direct dependency at the application level.
     */
    engramSchemaImportId?: string;
}
export declare type TypeToWalk = {
    type: 'named';
    value: GraphQLNamedType;
} | {
    type: 'input';
    value: EngramShapedInput;
} | {
    type: 'object';
    value: EngramShapedOutput;
} | {
    type: 'interface';
    value: EngramInterfaceTypeConfig<any>;
};
export declare type DynamicInputFields = Record<string, DynamicInputMethodDef<string> | string>;
export declare type DynamicOutputFields = Record<string, DynamicOutputMethodDef<string> | string>;
export declare type DynamicOutputProperties = Record<string, DynamicOutputPropertyDef<string>>;
export declare type TypeDef = GraphQLNamedType | AllEngramNamedTypeDefs | EngramExtendInputTypeDef<string> | EngramExtendTypeDef<string>;
export declare type DynamicBlockDef = DynamicInputMethodDef<string> | DynamicOutputMethodDef<string> | DynamicOutputPropertyDef<string>;
export declare type EngramAcceptedTypeDef = TypeDef | DynamicBlockDef;
export declare type PluginBuilderLens = {
    hasType: SchemaBuilder['hasType'];
    addType: SchemaBuilder['addType'];
    setConfigOption: SchemaBuilder['setConfigOption'];
    hasConfigOption: SchemaBuilder['hasConfigOption'];
    getConfigOption: SchemaBuilder['getConfigOption'];
};
/**
 * Builds all of the types, properly accounts for any using "mix".
 * Since the enum types are resolved synchronously, these need to guard for
 * circular references at this step, while fields will guard for it during lazy evaluation.
 */
export declare class SchemaBuilder {
    protected config: BuilderConfig;
    /**
     * Used to check for circular references.
     */
    protected buildingTypes: Set<unknown>;
    /**
     * The "final type" map contains all types as they are built.
     */
    protected finalTypeMap: Record<string, GraphQLNamedType>;
    /**
     * The "defined type" map keeps track of all of the types that were
     * defined directly as `GraphQL*Type` objects, so we don't accidentally
     * overwrite any.
     */
    protected definedTypeMap: Record<string, GraphQLNamedType>;
    /**
     * The "pending type" map keeps track of all types that were defined w/
     * GraphQL Engram and haven't been processed into concrete types yet.
     */
    protected pendingTypeMap: Record<string, AllEngramNamedTypeDefs>;
    /**
     * All "extensions" to types (adding fields on types from many locations)
     */
    protected typeExtendMap: Record<string, EngramExtendTypeConfig<string>[] | null>;
    /**
     * All "extensions" to input types (adding fields on types from many locations)
     */
    protected inputTypeExtendMap: Record<string, EngramExtendInputTypeConfig<string>[] | null>;
    /**
     * Configures the root-level nonNullDefaults defaults
     */
    protected nonNullDefaults: NonNullConfig;
    protected dynamicInputFields: DynamicInputFields;
    protected dynamicOutputFields: DynamicOutputFields;
    protected dynamicOutputProperties: DynamicOutputProperties;
    protected plugins: EngramPlugin[];
    /**
     * All types that need to be traversed for children types
     */
    protected typesToWalk: TypeToWalk[];
    /**
     * Root type mapping information annotated on the type definitions
     */
    protected rootTypings: RootTypings;
    /**
     * Array of missing types
     */
    protected missingTypes: Record<string, MissingType>;
    /**
     * Methods we are able to access to read/modify builder state from plugins
     */
    protected builderLens: PluginBuilderLens;
    /**
     * Created just before types are walked, this keeps track of all of the resolvers
     */
    protected onMissingTypeFns: Exclude<PluginConfig['onMissingType'], undefined>[];
    /**
     * Executed just before types are walked
     */
    protected onBeforeBuildFns: Exclude<PluginConfig['onBeforeBuild'], undefined>[];
    /**
     * Executed as the field resolvers are included on the field
     */
    protected onCreateResolverFns: Exclude<PluginConfig['onCreateFieldResolver'], undefined>[];
    /**
     * Executed as the field "subscribe" fields are included on the schema
     */
    protected onCreateSubscribeFns: Exclude<PluginConfig['onCreateFieldSubscribe'], undefined>[];
    /**
     * Executed after the schema is constructed, for any final verification
     */
    protected onAfterBuildFns: Exclude<PluginConfig['onAfterBuild'], undefined>[];
    /**
     * The `schemaExtension` is created just after the types are walked,
     * but before the fields are materialized.
     */
    protected _schemaExtension?: EngramSchemaExtension;
    get schemaExtension(): EngramSchemaExtension;
    constructor(config: BuilderConfig);
    setConfigOption: <K extends "nonNullDefaults" | "outputs" | "shouldGenerateArtifacts" | "typegenAutoConfig" | "typegenConfig" | "prettierConfig" | "formatTypegen" | "plugins" | "customPrintSchemaFn">(key: K, value: BuilderConfig[K]) => void;
    hasConfigOption: (key: keyof BuilderConfig) => boolean;
    getConfigOption: <K extends "nonNullDefaults" | "outputs" | "shouldGenerateArtifacts" | "typegenAutoConfig" | "typegenConfig" | "prettierConfig" | "formatTypegen" | "plugins" | "customPrintSchemaFn">(key: K) => BuilderConfig[K];
    hasType: (typeName: string) => boolean;
    /**
     * Add type takes a Engram type, or a GraphQL type and pulls
     * it into an internal "type registry". It also does an initial pass
     * on any types that are referenced on the "types" field and pulls
     * those in too, so you can define types anonymously, without
     * exporting them.
     */
    addType: (typeDef: TypeDef | DynamicBlockDef) => void;
    addTypes(types: any): void;
    rebuildNamedOutputFields(config: ReturnType<GraphQLObjectType['toConfig'] | GraphQLInterfaceType['toConfig']>): Record<string, any>;
    walkTypes(): void;
    beforeWalkTypes(): void;
    beforeBuildTypes(): void;
    buildEngramTypes(): void;
    createSchemaExtension(): void;
    getFinalTypeMap(): BuildTypes<any>;
    buildInputObjectType(config: EngramInputObjectTypeConfig<any>): GraphQLInputObjectType;
    buildObjectType(config: EngramObjectTypeConfig<any>): GraphQLObjectType<any, any>;
    buildInterfaceType(config: EngramInterfaceTypeConfig<any>): GraphQLInterfaceType;
    buildEnumType(config: EnumTypeConfig<any>): GraphQLEnumType;
    buildUnionType(config: EngramUnionTypeConfig<any>): GraphQLUnionType;
    buildScalarType(config: EngramScalarTypeConfig<string>): GraphQLScalarType;
    protected finalize<T extends GraphQLNamedType>(type: T): T;
    protected missingType(typeName: string, fromObject?: boolean): GraphQLNamedType;
    protected buildUnionMembers(unionName: string, members: UnionMembers | undefined): GraphQLObjectType<any, any>[];
    protected buildOutputFields(fields: EngramOutputFieldDef[], typeConfig: EngramGraphQLInterfaceTypeConfig | EngramGraphQLObjectTypeConfig, intoObject: GraphQLFieldConfigMap<any, any>): GraphQLFieldConfigMap<any, any>;
    protected buildInputObjectFields(fields: EngramInputFieldDef[], typeConfig: EngramGraphQLInputObjectTypeConfig): GraphQLInputFieldConfigMap;
    protected buildOutputField(fieldConfig: EngramOutputFieldDef, typeConfig: EngramGraphQLObjectTypeConfig | EngramGraphQLInterfaceTypeConfig): GraphQLFieldConfig<any, any>;
    protected makeFinalResolver(info: CreateFieldResolverInfo, resolver?: GraphQLFieldResolver<any, any>): GraphQLFieldResolver<any, any, {
        [argName: string]: any;
    }>;
    protected buildInputObjectField(field: EngramInputFieldDef, typeConfig: EngramGraphQLInputObjectTypeConfig): GraphQLInputFieldConfig;
    protected buildArgs(args: ArgsRecord, typeConfig: EngramGraphQLObjectTypeConfig | EngramGraphQLInterfaceTypeConfig): GraphQLFieldConfigArgumentMap;
    protected inputNonNull(typeDef: EngramGraphQLObjectTypeConfig | EngramGraphQLInterfaceTypeConfig | EngramGraphQLInputObjectTypeConfig, field: EngramInputFieldDef | EngramArgConfig<any>): boolean;
    protected outputNonNull(typeDef: EngramGraphQLObjectTypeConfig | EngramGraphQLInterfaceTypeConfig, field: EngramOutputFieldDef): boolean;
    protected decorateType<T extends GraphQLNamedType>(type: T, list: null | undefined | true | boolean[], isNonNull: boolean): T;
    protected decorateList<T extends GraphQLOutputType | GraphQLInputType>(type: T, list: true | boolean[]): T;
    protected getInterface(name: string | EngramInterfaceTypeDef<any>): GraphQLInterfaceType;
    protected getInputType(name: string | AllEngramInputTypeDefs): GraphQLPossibleInputs;
    protected getOutputType(name: string | AllEngramOutputTypeDefs): GraphQLPossibleOutputs;
    protected getObjectType(name: string | EngramObjectTypeDef<string>): GraphQLObjectType;
    protected getOrBuildType(name: string | AllEngramNamedTypeDefs, fromObject?: boolean): GraphQLNamedType;
    missingResolveType(name: string, location: 'union' | 'interface'): (obj: any) => any;
    protected walkInputType<T extends EngramShapedInput>(obj: T): T;
    addDynamicInputFields(block: InputDefinitionBlock<any>, isList: boolean): void;
    addDynamicOutputMembers(block: OutputDefinitionBlock<any>, isList: boolean, stage: 'walk' | 'build'): void;
    addDynamicScalar(methodName: string, typeName: string, block: OutputDefinitionBlock<any> | InputDefinitionBlock<any>): void;
    protected walkOutputType<T extends EngramShapedOutput>(obj: T): T;
    protected walkInterfaceType(obj: EngramInterfaceTypeConfig<any>): EngramInterfaceTypeConfig<any>;
    protected maybeTraverseOutputFieldType(type: EngramOutputFieldDef): void;
    protected maybeTraverseInputFieldType(type: EngramInputFieldDef): void;
    protected walkNamedTypes(namedType: GraphQLNamedType): void;
    protected addUnknownTypeInternal(t: GraphQLNamedType): void;
    protected addNamedTypeOutputField(obj: GraphQLField<any, any>): void;
    protected replaceNamedType(type: GraphQLType): any;
}
export declare type DynamicFieldDefs = {
    dynamicInputFields: DynamicInputFields;
    dynamicOutputFields: DynamicOutputFields;
    dynamicOutputProperties: DynamicOutputProperties;
};
export interface BuildTypes<TypeMapDefs extends Record<string, GraphQLNamedType>> {
    finalConfig: BuilderConfig;
    typeMap: TypeMapDefs;
    missingTypes: Record<string, MissingType>;
    schemaExtension: EngramSchemaExtension;
    onAfterBuildFns: SchemaBuilder['onAfterBuildFns'];
}
/**
 * Builds the schema, we may return more than just the schema
 * from this one day.
 */
export declare function makeSchemaInternal(config: SchemaConfig): {
    schema: EngramGraphQLSchema;
    missingTypes: Record<string, MissingType>;
    finalConfig: BuilderConfig;
};
/**
 * Defines the GraphQL schema, by combining the GraphQL types defined
 * by the GraphQL Engram layer or any manually defined GraphQLType objects.
 *
 * Requires at least one type be named "Query", which will be used as the
 * root query type.
 */
export declare function makeSchema(config: SchemaConfig): EngramGraphQLSchema;
/**
 * Like makeSchema except that typegen is always run
 * and waited upon.
 */
export declare function generateSchema(config: SchemaConfig): Promise<EngramGraphQLSchema>;
export declare namespace generateSchema {
    var withArtifacts: (config: SchemaConfig, typeFilePath: string | false) => Promise<{
        schema: EngramGraphQLSchema;
        schemaTypes: string;
        tsTypes: string;
    }>;
}
export {};
