import { GraphQLArgument, GraphQLEnumType, GraphQLField, GraphQLInputField, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLOutputType, GraphQLScalarType, GraphQLSchema, GraphQLUnionType, GraphQLWrappingType } from 'graphql';
import { GroupedTypes } from './utils';
export declare function convertSDL(sdl: string, commonjs?: null | boolean, json?: JSON): string;
/**
 * Convert an existing SDL schema into a GraphQL Engram format
 */
export declare class SDLConverter {
    protected commonjs: null | boolean;
    protected json: JSON;
    protected export: string;
    protected schema: GraphQLSchema | null;
    protected groupedTypes: GroupedTypes;
    protected usedImports: Set<string>;
    protected exports: Set<string>;
    constructor(sdl: string, commonjs?: null | boolean, json?: JSON);
    print(): string;
    printUsedImports(): string;
    printObjectTypes(): string;
    printObjectType(type: GraphQLObjectType): string;
    printObjectFields(type: GraphQLObjectType | GraphQLInterfaceType): string;
    printInputObjectFields(type: GraphQLInputObjectType): string;
    printField(source: 'input' | 'output', field: GraphQLField<any, any> | GraphQLInputField): string;
    printFieldMethod(source: 'input' | 'output', field: GraphQLField<any, any> | GraphQLInputField, type: Exclude<GraphQLOutputType, GraphQLWrappingType> | Exclude<GraphQLInputObjectType, GraphQLWrappingType>, list: boolean[], isNonNull: boolean): string;
    printMeta(val: any, key: string): any;
    printArg(arg: GraphQLArgument): string;
    printInterfaceTypes(): string;
    printInterfaceType(type: GraphQLInterfaceType): string;
    printEnumTypes(): string;
    printEnumType(type: GraphQLEnumType): string;
    printInputObjectTypes(): string;
    printInputObjectType(type: GraphQLInputObjectType): string;
    printUnionTypes(): string;
    printUnionType(type: GraphQLUnionType): string;
    printScalarTypes(): string;
    printScalarType(type: GraphQLScalarType): string;
    printExports(): string;
    maybeAsEngramType(type: GraphQLScalarType): string | null;
    maybeDescription(type: GraphQLNamedType): string | null;
    printBlock(block: (string | null)[]): string;
}
