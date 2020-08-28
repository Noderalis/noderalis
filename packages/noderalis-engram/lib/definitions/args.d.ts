import { AllInputTypes, GetGen2 } from '../typegenTypeHelpers';
import { AllEngramInputTypeDefs } from './wrapping';
export declare type ArgsRecord = Record<string, EngramArgDef<AllInputTypes> | AllInputTypes | AllEngramInputTypeDefs<string>>;
export interface CommonArgConfig {
    /**
     * Whether the field is required, `required: true` = `nullable: false`
     */
    required?: boolean;
    /**
     * Whether the field is nullable, `nullable: true` = `required: false`
     */
    nullable?: boolean;
    /**
     * Whether the argument is a list or not.
     *
     * null = not a list
     * true = list
     * array = nested list, where true/false decides
     * whether the list member can be nullable
     */
    list?: null | true | boolean[];
    /**
     * The description to annotate the GraphQL SDL
     */
    description?: string | null;
}
export interface ScalarArgConfig<T> extends CommonArgConfig {
    /**
     * Configure the default for the object
     */
    default?: T;
}
export declare type EngramArgConfigType<T extends AllInputTypes> = T | AllEngramInputTypeDefs<T>;
export interface EngramAsArgConfig<T extends AllInputTypes> extends CommonArgConfig {
    /**
     * Configure the default for the object
     */
    default?: GetGen2<'allTypes', T>;
}
export interface EngramArgConfig<T extends AllInputTypes> extends EngramAsArgConfig<T> {
    /**
     * The type of the argument, either the string name of the type,
     * or the concrete Engram type definition
     */
    type: EngramArgConfigType<T>;
}
export declare class EngramArgDef<TypeName extends AllInputTypes> {
    readonly name: string;
    protected config: EngramArgConfig<TypeName>;
    constructor(name: string, config: EngramArgConfig<TypeName>);
    get value(): EngramArgConfig<TypeName>;
}
/**
 * Defines an argument that can be used in any object or interface type
 *
 * Takes the GraphQL type name and any options.
 *
 * The value returned from this argument can be used multiple times in any valid `args` object value
 *
 * @see https://graphql.github.io/learn/schema/#arguments
 */
export declare function arg<T extends AllInputTypes>(options: {
    type: EngramArgConfigType<T>;
} & EngramArgConfig<T>): EngramArgDef<T>;
export declare function stringArg(options?: ScalarArgConfig<string>): EngramArgDef<"String">;
export declare function intArg(options?: ScalarArgConfig<number>): EngramArgDef<"Int">;
export declare function floatArg(options?: ScalarArgConfig<number>): EngramArgDef<"Float">;
export declare function idArg(options?: ScalarArgConfig<string>): EngramArgDef<"ID">;
export declare function booleanArg(options?: ScalarArgConfig<boolean>): EngramArgDef<"Boolean">;
