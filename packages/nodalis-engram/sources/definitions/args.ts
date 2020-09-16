import { AllInputTypes, GetGen2 } from '../typegenTypeHelpers';
import { AllEngramInputTypeDefs } from './wrapping';
import { EngramTypes, withEngramSymbol } from './_types';

export type ArgsRecord = Record<
	string,
	EngramArgDef<AllInputTypes> | AllInputTypes | AllEngramInputTypeDefs<string>
>;

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

export type EngramArgConfigType<T extends AllInputTypes> =
	| T
	| AllEngramInputTypeDefs<T>;

export interface EngramAsArgConfig<T extends AllInputTypes>
	extends CommonArgConfig {
	/**
	 * Configure the default for the object
	 */
	default?: GetGen2<'allTypes', T>; // TODO: Make this type-safe somehow
}

export interface EngramArgConfig<T extends AllInputTypes>
	extends EngramAsArgConfig<T> {
	/**
	 * The type of the argument, either the string name of the type,
	 * or the concrete Engram type definition
	 */
	type: EngramArgConfigType<T>;
}

export class EngramArgDef<TypeName extends AllInputTypes> {
	constructor(
		readonly name: string,
		protected config: EngramArgConfig<TypeName>
	) {}
	get value() {
		return this.config;
	}
}
withEngramSymbol(EngramArgDef, EngramTypes.Arg);

/**
 * Defines an argument that can be used in any object or interface type
 *
 * Takes the GraphQL type name and any options.
 *
 * The value returned from this argument can be used multiple times in any valid `args` object value
 *
 * @see https://graphql.github.io/learn/schema/#arguments
 */
export function arg<T extends AllInputTypes>(
	options: { type: EngramArgConfigType<T> } & EngramArgConfig<T>
) {
	if (!options.type) {
		throw new Error('You must provide a "type" for the arg()');
	}
	return new EngramArgDef(
		typeof options.type === 'string'
			? options.type
			: (options.type as any).name,
		options
	);
}
export function stringArg(options?: ScalarArgConfig<string>) {
	return arg({ type: 'String', ...options });
}
export function intArg(options?: ScalarArgConfig<number>) {
	return arg({ type: 'Int', ...options });
}
export function floatArg(options?: ScalarArgConfig<number>) {
	return arg({ type: 'Float', ...options });
}
export function idArg(options?: ScalarArgConfig<string>) {
	return arg({ type: 'ID', ...options });
}
export function booleanArg(options?: ScalarArgConfig<boolean>) {
	return arg({ type: 'Boolean', ...options });
}
