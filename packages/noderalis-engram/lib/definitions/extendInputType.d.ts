import { GetGen } from '../typegenTypeHelpers';
import { InputDefinitionBlock } from './definitionBlocks';
export interface EngramExtendInputTypeConfig<TypeName extends string> {
    type: TypeName;
    definition(t: InputDefinitionBlock<TypeName>): void;
}
export declare class EngramExtendInputTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: EngramExtendInputTypeConfig<string> & {
        name: string;
    };
    constructor(name: TypeName, config: EngramExtendInputTypeConfig<string> & {
        name: string;
    });
    get value(): EngramExtendInputTypeConfig<string> & {
        name: string;
    };
}
/**
 * Adds new fields to an existing inputObjectType in the schema. Useful when
 * splitting your schema across several domains.
 *
 * @see http://graphql-engram.com/api/extendType
 */
export declare function extendInputType<TypeName extends GetGen<'inputNames', string>>(config: EngramExtendInputTypeConfig<TypeName>): EngramExtendInputTypeDef<TypeName>;
