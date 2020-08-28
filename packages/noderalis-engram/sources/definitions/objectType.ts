import { assertValidName } from 'graphql';
import { FieldResolver, GetGen } from '../typegenTypeHelpers';
import {
	OutputDefinitionBlock,
	OutputDefinitionBuilder,
} from './definitionBlocks';
import { EngramInterfaceTypeDef } from './interfaceType';
import {
	EngramTypes,
	NonNullConfig,
	Omit,
	RootTypingDef,
	withEngramSymbol,
} from './_types';

export type Implemented =
	| GetGen<'interfaceNames'>
	| EngramInterfaceTypeDef<any>;

export interface FieldModification<
	TypeName extends string,
	FieldName extends string
> {
	/**
	 * The description to annotate the GraphQL SDL
	 */
	description?: string | null;
	/**
	 * The resolve method we should be resolving the field with
	 */
	resolve?: FieldResolver<TypeName, FieldName>;
}

export interface FieldModificationDef<
	TypeName extends string,
	FieldName extends string
> extends FieldModification<TypeName, FieldName> {
	field: FieldName;
}

export interface ObjectDefinitionBuilder<TypeName extends string>
	extends OutputDefinitionBuilder {
	addInterfaces(toAdd: Implemented[]): void;
}

export class ObjectDefinitionBlock<
	TypeName extends string
> extends OutputDefinitionBlock<TypeName> {
	constructor(protected typeBuilder: ObjectDefinitionBuilder<TypeName>) {
		super(typeBuilder);
	}
	/**
	 * @param interfaceName
	 */
	implements(...interfaceName: Array<Implemented>) {
		this.typeBuilder.addInterfaces(interfaceName);
	}
	/**
	 * Modifies a field added via an interface
	 */
	modify(field: any, modifications: any) {
		throw new Error(`
      The Engram objectType.modify API has been removed. If you were using this API, please open an issue on 
      GitHub to discuss your use case so we can discuss a suitable replacement.
    `);
	}
}

export type EngramObjectTypeConfig<TypeName extends string> = {
	name: TypeName;
	definition(t: ObjectDefinitionBlock<TypeName>): void;
	/**
	 * Configures the nullability for the type, check the
	 * documentation's "Getting Started" section to learn
	 * more about GraphQL Engram's assumptions and configuration
	 * on nullability.
	 */
	nonNullDefaults?: NonNullConfig;
	/**
	 * The description to annotate the GraphQL SDL
	 */
	description?: string | null;
	/**
	 * Root type information for this type
	 */
	rootTyping?: RootTypingDef;
} & EngramGenPluginTypeConfig<TypeName>;

export class EngramObjectTypeDef<TypeName extends string> {
	constructor(
		readonly name: TypeName,
		protected config: EngramObjectTypeConfig<TypeName>
	) {
		assertValidName(name);
	}
	get value() {
		return this.config;
	}
}

withEngramSymbol(EngramObjectTypeDef, EngramTypes.Object);

export function objectType<TypeName extends string>(
	config: EngramObjectTypeConfig<TypeName>
) {
	return new EngramObjectTypeDef<TypeName>(config.name, config);
}

export function queryType(
	config: Omit<EngramObjectTypeConfig<'Query'>, 'name'>
) {
	return objectType({ ...config, name: 'Query' });
}

export function mutationType(
	config: Omit<EngramObjectTypeConfig<'Mutation'>, 'name'>
) {
	return objectType({ ...config, name: 'Mutation' });
}
