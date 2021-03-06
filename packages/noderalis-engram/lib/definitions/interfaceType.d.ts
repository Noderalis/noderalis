import { AbstractTypeResolver } from '../typegenTypeHelpers';
import { AbstractOutputDefinitionBuilder, OutputDefinitionBlock } from './definitionBlocks';
import { NonNullConfig, RootTypingDef } from './_types';
export declare type EngramInterfaceTypeConfig<TypeName extends string> = {
    name: TypeName;
    definition(t: InterfaceDefinitionBlock<TypeName>): void;
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
};
export declare class InterfaceDefinitionBlock<TypeName extends string> extends OutputDefinitionBlock<TypeName> {
    protected typeBuilder: AbstractOutputDefinitionBuilder<TypeName>;
    constructor(typeBuilder: AbstractOutputDefinitionBuilder<TypeName>);
    /**
     * Sets the "resolveType" method for the current type.
     */
    resolveType(fn: AbstractTypeResolver<TypeName>): void;
}
export declare class EngramInterfaceTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: EngramInterfaceTypeConfig<TypeName>;
    constructor(name: TypeName, config: EngramInterfaceTypeConfig<TypeName>);
    get value(): EngramInterfaceTypeConfig<TypeName>;
}
/**
 * Defines a GraphQLInterfaceType
 * @param config
 */
export declare function interfaceType<TypeName extends string>(config: EngramInterfaceTypeConfig<TypeName>): EngramInterfaceTypeDef<TypeName>;
