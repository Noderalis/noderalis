import { assertValidName } from 'graphql';
import { arg, EngramArgDef, EngramAsArgConfig } from './args';
import { InputDefinitionBlock } from './definitionBlocks';
import { EngramTypes, NonNullConfig, withEngramSymbol } from './_types';

export interface EngramInputObjectTypeConfig<TypeName extends string> {
	/**
	 * Name of the input object type
	 */
	name: TypeName;
	/**
	 * Definition block for the input type
	 */
	definition(t: InputDefinitionBlock<TypeName>): void;
	/**
	 * The description to annotate the GraphQL SDL
	 */
	description?: string | null;
	/**
	 * Configures the nullability for the type, check the
	 * documentation's "Getting Started" section to learn
	 * more about GraphQL Engram's assumptions and configuration
	 * on nullability.
	 */
	nonNullDefaults?: NonNullConfig;
}

export class EngramInputObjectTypeDef<TypeName extends string> {
	constructor(
		readonly name: TypeName,
		protected config: EngramInputObjectTypeConfig<string>
	) {
		assertValidName(name);
	}
	get value() {
		return this.config;
	}
	// FIXME
	// Instead of `any` we want to pass the name of this type...
	// so that the correct `cfg.default` type can be looked up
	// from the typegen.
	asArg(cfg?: EngramAsArgConfig<any>): EngramArgDef<any> {
		// FIXME
		return arg({ ...cfg, type: this } as any);
	}
}
withEngramSymbol(EngramInputObjectTypeDef, EngramTypes.InputObject);

export function inputObjectType<TypeName extends string>(
	config: EngramInputObjectTypeConfig<TypeName>
) {
	return new EngramInputObjectTypeDef(config.name, config);
}
