import { EngramArgDef, EngramAsArgConfig } from './args';
import { InputDefinitionBlock } from './definitionBlocks';
import { NonNullConfig } from './_types';
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
export declare class EngramInputObjectTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: EngramInputObjectTypeConfig<string>;
    constructor(name: TypeName, config: EngramInputObjectTypeConfig<string>);
    get value(): EngramInputObjectTypeConfig<string>;
    asArg(cfg?: EngramAsArgConfig<any>): EngramArgDef<any>;
}
export declare function inputObjectType<TypeName extends string>(config: EngramInputObjectTypeConfig<TypeName>): EngramInputObjectTypeDef<TypeName>;
