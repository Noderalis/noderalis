import { FieldResolver, GetGen } from '../typegenTypeHelpers';
import { OutputDefinitionBlock, OutputDefinitionBuilder } from './definitionBlocks';
import { EngramInterfaceTypeDef } from './interfaceType';
import { NonNullConfig, Omit, RootTypingDef } from './_types';
export declare type Implemented = GetGen<'interfaceNames'> | EngramInterfaceTypeDef<any>;
export interface FieldModification<TypeName extends string, FieldName extends string> {
    /**
     * The description to annotate the GraphQL SDL
     */
    description?: string | null;
    /**
     * The resolve method we should be resolving the field with
     */
    resolve?: FieldResolver<TypeName, FieldName>;
}
export interface FieldModificationDef<TypeName extends string, FieldName extends string> extends FieldModification<TypeName, FieldName> {
    field: FieldName;
}
export interface ObjectDefinitionBuilder<TypeName extends string> extends OutputDefinitionBuilder {
    addInterfaces(toAdd: Implemented[]): void;
}
export declare class ObjectDefinitionBlock<TypeName extends string> extends OutputDefinitionBlock<TypeName> {
    protected typeBuilder: ObjectDefinitionBuilder<TypeName>;
    constructor(typeBuilder: ObjectDefinitionBuilder<TypeName>);
    /**
     * @param interfaceName
     */
    implements(...interfaceName: Array<Implemented>): void;
    /**
     * Modifies a field added via an interface
     */
    modify(field: any, modifications: any): void;
}
export declare type EngramObjectTypeConfig<TypeName extends string> = {
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
export declare class EngramObjectTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: EngramObjectTypeConfig<TypeName>;
    constructor(name: TypeName, config: EngramObjectTypeConfig<TypeName>);
    get value(): EngramObjectTypeConfig<TypeName>;
}
export declare function objectType<TypeName extends string>(config: EngramObjectTypeConfig<TypeName>): EngramObjectTypeDef<TypeName>;
export declare function queryType(config: Omit<EngramObjectTypeConfig<'Query'>, 'name'>): EngramObjectTypeDef<"Query">;
export declare function mutationType(config: Omit<EngramObjectTypeConfig<'Mutation'>, 'name'>): EngramObjectTypeDef<"Mutation">;
