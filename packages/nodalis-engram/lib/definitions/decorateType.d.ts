import { GraphQLNamedType } from 'graphql';
import { RootTypingDef } from './_types';
export interface TypeExtensionConfig {
    asEngramMethod?: string;
    rootTyping?: RootTypingDef;
}
export declare type EngramTypeExtensions = {
    engram: TypeExtensionConfig;
};
export declare function decorateType<T extends GraphQLNamedType>(type: T, config: TypeExtensionConfig): T;
