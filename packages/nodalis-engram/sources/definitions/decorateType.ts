import { GraphQLNamedType } from 'graphql';
import { RootTypingDef } from './_types';

export interface TypeExtensionConfig {
	asEngramMethod?: string;
	rootTyping?: RootTypingDef;
}

export type EngramTypeExtensions = {
	engram: TypeExtensionConfig;
};

export function decorateType<T extends GraphQLNamedType>(
	type: T,
	config: TypeExtensionConfig
): T {
	type.extensions = {
		...type.extensions,
		engram: {
			asEngramMethod: config.asEngramMethod,
			rootTyping: config.rootTyping,
		},
	};
	return type as any;
}
