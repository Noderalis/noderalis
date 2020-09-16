import { assertValidName } from 'graphql';
import { AllOutputTypesPossible } from '../typegenTypeHelpers';
import { OutputDefinitionBlock } from './definitionBlocks';
import { EngramTypes, withEngramSymbol } from './_types';

export interface EngramExtendTypeConfig<TypeName extends string> {
	type: TypeName;
	definition(t: OutputDefinitionBlock<TypeName>): void;
}

export class EngramExtendTypeDef<TypeName extends string> {
	constructor(
		readonly name: TypeName,
		protected config: EngramExtendTypeConfig<TypeName> & { name: TypeName }
	) {
		assertValidName(name);
	}
	get value() {
		return this.config;
	}
}

withEngramSymbol(EngramExtendTypeDef, EngramTypes.ExtendObject);

/**
 * Adds new fields to an existing objectType in the schema. Useful when
 * splitting your schema across several domains.
 *
 * @see http://graphql-engram.com/api/extendType
 */
export function extendType<TypeName extends AllOutputTypesPossible>(
	config: EngramExtendTypeConfig<TypeName>
) {
	return new EngramExtendTypeDef(config.type, { ...config, name: config.type });
}
