import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { RootTypingDef } from './_types';
export interface ScalarBase extends Pick<GraphQLScalarTypeConfig<any, any>, 'description' | 'serialize' | 'parseValue' | 'parseLiteral'> {
}
export interface ScalarConfig {
    /**
     * Any deprecation info for this scalar type
     */
    deprecation?: string;
    /**
     * Adds this type as a method on the Object/Interface definition blocks
     */
    asEngramMethod?: string;
    /**
     * Root type information for this type
     */
    rootTyping?: RootTypingDef;
}
export interface EngramScalarTypeConfig<T extends string> extends ScalarBase, ScalarConfig {
    /**
     * The name of the scalar type
     */
    name: T;
}
export declare class EngramScalarTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: EngramScalarTypeConfig<string>;
    constructor(name: TypeName, config: EngramScalarTypeConfig<string>);
    get value(): EngramScalarTypeConfig<string>;
}
export declare type EngramScalarExtensions = {
    engram: {
        asEngramMethod?: string;
        rootTyping?: RootTypingDef;
    };
};
export declare function scalarType<TypeName extends string>(options: EngramScalarTypeConfig<TypeName>): EngramScalarTypeDef<TypeName>;
export declare function asEngramMethod<T extends GraphQLScalarType>(scalar: T, methodName: string, rootTyping?: RootTypingDef): T;
