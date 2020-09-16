import {
	assertValidName,
	GraphQLScalarType,
	GraphQLScalarTypeConfig,
} from 'graphql';
import { decorateType } from './decorateType';
import { EngramTypes, RootTypingDef, withEngramSymbol } from './_types';

export interface ScalarBase
	extends Pick<
		GraphQLScalarTypeConfig<any, any>,
		'description' | 'serialize' | 'parseValue' | 'parseLiteral'
	> {}

export interface ScalarConfig {
	/**
	 * Any deprecation info for this scalar type
	 */
	deprecation?: string; // | DeprecationInfo;
	/**
	 * Adds this type as a method on the Object/Interface definition blocks
	 */
	asEngramMethod?: string;
	/**
	 * Root type information for this type
	 */
	rootTyping?: RootTypingDef;
}

export interface EngramScalarTypeConfig<T extends string>
	extends ScalarBase,
		ScalarConfig {
	/**
	 * The name of the scalar type
	 */
	name: T;
}

export class EngramScalarTypeDef<TypeName extends string> {
	constructor(
		readonly name: TypeName,
		protected config: EngramScalarTypeConfig<string>
	) {
		assertValidName(name);
	}
	get value() {
		return this.config;
	}
}

withEngramSymbol(EngramScalarTypeDef, EngramTypes.Scalar);

export type EngramScalarExtensions = {
	engram: {
		asEngramMethod?: string;
		rootTyping?: RootTypingDef;
	};
};

export function scalarType<TypeName extends string>(
	options: EngramScalarTypeConfig<TypeName>
) {
	return new EngramScalarTypeDef(options.name, options);
}

export function asEngramMethod<T extends GraphQLScalarType>(
	scalar: T,
	methodName: string,
	rootTyping?: RootTypingDef
): T {
	return decorateType(scalar, {
		asEngramMethod: methodName,
		rootTyping: rootTyping,
	});
}
