import {
	GraphQLCompositeType,
	GraphQLEnumType,
	GraphQLFieldConfig,
	GraphQLInputObjectType,
	GraphQLInputObjectTypeConfig,
	GraphQLInterfaceType,
	GraphQLInterfaceTypeConfig,
	GraphQLLeafType,
	GraphQLObjectType,
	GraphQLObjectTypeConfig,
	GraphQLScalarType,
	GraphQLSchema,
	GraphQLUnionType,
} from 'graphql';
import {
	EngramFieldExtension,
	EngramInputObjectTypeExtension,
	EngramInterfaceTypeExtension,
	EngramObjectTypeExtension,
	EngramSchemaExtension,
} from '../extensions';

export type Maybe<T> = T | null;

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type BaseScalars = 'String' | 'Int' | 'Float' | 'ID' | 'Boolean';

export enum EngramTypes {
	Arg = 'Arg',
	Enum = 'Enum',
	Object = 'Object',
	Interface = 'Interface',
	InputObject = 'InputObject',
	Scalar = 'Scalar',
	Union = 'Union',
	ExtendObject = 'ExtendObject',
	ExtendInputObject = 'ExtendInputObject',
	OutputField = 'OutputField',
	InputField = 'InputField',
	DynamicInput = 'DynamicInput',
	DynamicOutputMethod = 'DynamicOutputMethod',
	DynamicOutputProperty = 'DynamicOutputProperty',
	Plugin = 'Plugin',
	PrintedGenTyping = 'PrintedGenTyping',
	PrintedGenTypingImport = 'PrintedGenTypingImport',
}

export interface DeprecationInfo {
	/**
	 * Reason for the deprecation.
	 */
	reason: string;
	/**
	 * Date | YYYY-MM-DD formatted date of when this field
	 * became deprecated.
	 */
	startDate?: string | Date;
	/**
	 * Field or usage that replaces the deprecated field.
	 */
	supersededBy?: string;
}

export interface NonNullConfig {
	/**
	 * Whether output fields are non-null by default.
	 *
	 * type Example {
	 *   field: String!
	 *   otherField: [String!]!
	 * }
	 *
	 * @default true
	 */
	output?: boolean;
	/**
	 * Whether input fields (field arguments, input type members)
	 * are non-null by default.
	 *
	 * input Example {
	 *   field: String
	 *   something: [String]
	 * }
	 *
	 * @default false
	 */
	input?: boolean;
}

export type GraphQLPossibleOutputs = GraphQLCompositeType | GraphQLLeafType;

export type GraphQLPossibleInputs = GraphQLInputObjectType | GraphQLLeafType;

export const EngramWrappedSymbol = Symbol.for('@engram/wrapped');

export function withEngramSymbol(obj: Function, engramType: EngramTypes) {
	obj.prototype[EngramWrappedSymbol] = engramType;
}

export interface AsyncIterator<T> {
	next(value?: any): Promise<IteratorResult<T>>;
	return?(value?: any): Promise<IteratorResult<T>>;
	throw?(e?: any): Promise<IteratorResult<T>>;
}

export type RootTypingDef = string | RootTypingImport;

export type RootTypings = Record<string, string | RootTypingImport>;

export interface RootTypingImport {
	/**
	 * File path to import the type from.
	 */
	path: string;
	/**
	 * Name of the type we want to reference in the `path`
	 */
	name: string;
	/**
	 * Name we want the imported type to be referenced as
	 */
	alias?: string;
}

export interface MissingType {
	fromObject: boolean;
}

export type GraphQLNamedOutputType =
	| GraphQLScalarType
	| GraphQLObjectType
	| GraphQLInterfaceType
	| GraphQLUnionType
	| GraphQLEnumType;

export type GraphQLNamedInputType =
	| GraphQLScalarType
	| GraphQLInputObjectType
	| GraphQLEnumType;

type WithExt<T extends { extensions?: any }, Ext> = Omit<T, 'extensions'> & {
	extensions?: Maybe<{ engram?: Ext }>;
};

export type EngramGraphQLFieldConfig = WithExt<
	GraphQLFieldConfig<any, any>,
	EngramFieldExtension
> & {
	name: string;
};

export type EngramGraphQLObjectTypeConfig = WithExt<
	GraphQLObjectTypeConfig<any, any>,
	EngramObjectTypeExtension
>;

export type EngramGraphQLInputObjectTypeConfig = WithExt<
	GraphQLInputObjectTypeConfig,
	EngramInputObjectTypeExtension
>;

export type EngramGraphQLInterfaceTypeConfig = WithExt<
	GraphQLInterfaceTypeConfig<any, any>,
	EngramInterfaceTypeExtension
>;

export type EngramGraphQLSchema = Omit<GraphQLSchema, 'extensions'> & {
	extensions: { engram: EngramSchemaExtension };
};
