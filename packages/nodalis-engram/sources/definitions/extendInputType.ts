import { assertValidName } from 'graphql';
import { GetGen } from '../typegenTypeHelpers';
import { InputDefinitionBlock } from './definitionBlocks';
import { EngramTypes, withEngramSymbol } from './_types';

export interface EngramExtendInputTypeConfig<TypeName extends string> {
	type: TypeName;
	definition(t: InputDefinitionBlock<TypeName>): void;
}

export class EngramExtendInputTypeDef<TypeName extends string> {
	constructor(
		readonly name: TypeName,
		protected config: EngramExtendInputTypeConfig<string> & { name: string }
	) {
		assertValidName(name);
	}
	get value() {
		return this.config;
	}
}

withEngramSymbol(EngramExtendInputTypeDef, EngramTypes.ExtendInputObject);

/**
 * Adds new fields to an existing inputObjectType in the schema. Useful when
 * splitting your schema across several domains.
 *
 * @see http://graphql-engram.com/api/extendType
 */
export function extendInputType<TypeName extends GetGen<'inputNames', string>>(
	config: EngramExtendInputTypeConfig<TypeName>
) {
	return new EngramExtendInputTypeDef(config.type, {
		...config,
		name: config.type,
	});
}
