import { AllOutputTypesPossible } from '../typegenTypeHelpers';
import { OutputDefinitionBlock } from './definitionBlocks';
export interface EngramExtendTypeConfig<TypeName extends string> {
    type: TypeName;
    definition(t: OutputDefinitionBlock<TypeName>): void;
}
export declare class EngramExtendTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: EngramExtendTypeConfig<TypeName> & {
        name: TypeName;
    };
    constructor(name: TypeName, config: EngramExtendTypeConfig<TypeName> & {
        name: TypeName;
    });
    get value(): EngramExtendTypeConfig<TypeName> & {
        name: TypeName;
    };
}
/**
 * Adds new fields to an existing objectType in the schema. Useful when
 * splitting your schema across several domains.
 *
 * @see http://graphql-engram.com/api/extendType
 */
export declare function extendType<TypeName extends AllOutputTypesPossible>(config: EngramExtendTypeConfig<TypeName>): EngramExtendTypeDef<TypeName>;
