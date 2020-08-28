import { GraphQLNamedType } from 'graphql';
import { DynamicFieldDefs, SchemaConfig } from './builder';
import { EngramOutputFieldConfig } from './definitions/definitionBlocks';
import { EngramInputObjectTypeConfig } from './definitions/inputObjectType';
import { EngramInterfaceTypeConfig } from './definitions/interfaceType';
import { EngramObjectTypeConfig } from './definitions/objectType';
import { RootTypings } from './definitions/_types';

export type EngramGraphQLNamedType = GraphQLNamedType & {
	extensions?: {
		engram?: {
			config: any;
		};
	};
};

export type EngramTypeExtensions =
	| EngramObjectTypeExtension
	| EngramInterfaceTypeExtension;

/**
 * Container object living on `fieldDefinition.extensions.engram`
 */
export class EngramFieldExtension<
	TypeName extends string = any,
	FieldName extends string = any
> {
	readonly config: Omit<
		EngramOutputFieldConfig<TypeName, FieldName>,
		'resolve'
	>;
	/**
	 * Whether the user has provided a custom "resolve" function,
	 * or whether we're using GraphQL's defaultResolver
	 */
	readonly hasDefinedResolver: boolean;
	constructor(config: EngramOutputFieldConfig<TypeName, FieldName>) {
		const { resolve, ...rest } = config;
		this.config = rest;
		this.hasDefinedResolver = Boolean(resolve);
	}
}

/**
 * Container object living on `inputObjectType.extensions.engram`
 */
export class EngramInputObjectTypeExtension<TypeName extends string = any> {
	readonly config: Omit<EngramInputObjectTypeConfig<TypeName>, 'definition'>;
	constructor(config: EngramInputObjectTypeConfig<TypeName>) {
		const { definition, ...rest } = config;
		this.config = rest;
	}
}

/**
 * Container object living on `objectType.extensions.engram`
 */
export class EngramObjectTypeExtension<TypeName extends string = any> {
	readonly config: Omit<EngramObjectTypeConfig<TypeName>, 'definition'>;
	constructor(config: EngramObjectTypeConfig<TypeName>) {
		const { definition, ...rest } = config;
		this.config = rest;
	}
}

/**
 * Container object living on `interfaceType.extensions.engram`
 */
export class EngramInterfaceTypeExtension<TypeName extends string = any> {
	readonly config: Omit<EngramInterfaceTypeConfig<TypeName>, 'definition'>;
	constructor(config: EngramInterfaceTypeConfig<TypeName>) {
		const { definition, ...rest } = config;
		this.config = rest;
	}
}

export interface EngramSchemaExtensionConfig
	extends Omit<SchemaConfig, 'types'> {
	dynamicFields: DynamicFieldDefs;
	rootTypings: RootTypings;
}

/**
 * Container object living on `schema.extensions.engram`. Keeps track
 * of metadata from the builder so we can use it when we
 */
export class EngramSchemaExtension {
	constructor(readonly config: EngramSchemaExtensionConfig) {}
}
