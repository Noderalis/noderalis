import { GraphQLResolveInfo } from 'graphql';
declare global {
    interface EngramGen {
    }
    interface EngramGenCustomInputMethods<TypeName extends string> {
    }
    interface EngramGenCustomOutputMethods<TypeName extends string> {
    }
    interface EngramGenCustomOutputProperties<TypeName extends string> {
    }
    interface EngramGenPluginSchemaConfig {
    }
    interface EngramGenPluginTypeConfig<TypeName extends string> {
    }
    interface EngramGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    }
}
export declare type AllInputTypes = GetGen<'allInputTypes', string>;
export declare type AllOutputTypes = GetGen<'allOutputTypes', string>;
/**
 * This type captures all output types defined in the app
 * as well as core GraphQL spec objects.
 */
export declare type AllOutputTypesPossible = AllOutputTypes | 'Query' | 'Mutation' | 'Subscription';
export declare type FieldType<TypeName extends string, FieldName extends string> = GetGen3<'fieldTypes', TypeName, FieldName>;
export declare type MaybePromise<T> = PromiseLike<T> | T;
/**
 * Because the GraphQL field execution algorithm automatically
 * resolves promises at any level of the tree, we use this
 * to help signify that.
 */
export declare type MaybePromiseDeep<T> = Date extends T ? MaybePromise<T> : null extends T ? MaybePromise<T> : boolean extends T ? MaybePromise<T> : number extends T ? MaybePromise<T> : string extends T ? MaybePromise<T> : T extends Array<infer U> ? MaybePromise<Array<MaybePromiseDeep<U>>> : T extends ReadonlyArray<infer Y> ? MaybePromise<ReadonlyArray<MaybePromiseDeep<Y>>> : T extends object ? MaybePromise<T | {
    [P in keyof T]: MaybePromiseDeep<T[P]>;
}> : MaybePromise<T>;
/**
 * The EngramAbstractTypeResolver type can be used if you want to preserve type-safety
 * and autocomplete on an abstract type resolver (interface or union) outside of the Engram
 * configuration
 *
 * @example
 * ```
 * const mediaType: AbstractTypeResolver<'MediaType'> = (root, ctx, info) => {
 *   if (ctx.user.isLoggedIn()) {
 *     return ctx.user.getItems()
 *   }
 *   return null
 * }
 * ```
 */
export interface AbstractTypeResolver<TypeName extends string> {
    (source: RootValue<TypeName>, context: GetGen<'context'>, info: GraphQLResolveInfo): MaybePromise<AbstractResolveReturn<TypeName> | null>;
}
/**
 * The FieldResolver type can be used when you want to preserve type-safety
 * and autocomplete on a resolver outside of the Engram definition block
 *
 * @example
 * ```
 * const userItems: FieldResolver<'User', 'items'> = (root, args, ctx, info) => {
 *   if (ctx.user.isLoggedIn()) {
 *     return ctx.user.getItems()
 *   }
 *   return null
 * }
 * ```
 */
export declare type FieldResolver<TypeName extends string, FieldName extends string> = (root: RootValue<TypeName>, args: ArgsValue<TypeName, FieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<ResultValue<TypeName, FieldName>> | MaybePromiseDeep<ResultValue<TypeName, FieldName>>;
export declare type SubFieldResolver<TypeName extends string, FieldName extends string, SubFieldName extends string> = (root: RootValue<TypeName>, args: ArgsValue<TypeName, FieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<ResultValue<TypeName, FieldName>[SubFieldName]> | MaybePromiseDeep<ResultValue<TypeName, FieldName>[SubFieldName]>;
export declare type AbstractResolveReturn<TypeName extends string> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? TypeName extends keyof GenTypes['abstractResolveReturn'] ? GenTypes['abstractResolveReturn'][TypeName] : any : any : any;
/**
 * Generated type helpers:
 */
export declare type GenTypesShapeKeys = 'context' | 'inputTypes' | 'rootTypes' | 'argTypes' | 'fieldTypes' | 'allTypes' | 'inheritedFields' | 'objectNames' | 'inputNames' | 'enumNames' | 'interfaceNames' | 'scalarNames' | 'unionNames' | 'allInputTypes' | 'allOutputTypes' | 'allNamedTypes' | 'abstractTypes' | 'abstractResolveReturn';
/**
 * Helpers for handling the generated schema
 */
export declare type GenTypesShape = Record<GenTypesShapeKeys, any>;
export declare type GetGen<K extends GenTypesShapeKeys, Fallback = any> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? GenTypes[K] : Fallback : Fallback;
export declare type GetGen2<K extends GenTypesShapeKeys, K2 extends keyof GenTypesShape[K]> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? K extends keyof GenTypes ? K2 extends keyof GenTypes[K] ? GenTypes[K][K2] : any : any : any : any;
export declare type GetGen3<K extends GenTypesShapeKeys, K2 extends Extract<keyof GenTypesShape[K], string>, K3 extends Extract<keyof GenTypesShape[K][K2], string>, Fallback = any> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? K extends keyof GenTypes ? K2 extends keyof GenTypes[K] ? K3 extends keyof GenTypes[K][K2] ? GenTypes[K][K2][K3] : Fallback : any : any : any : any;
export declare type HasGen<K extends GenTypesShapeKeys> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? K extends keyof GenTypes ? true : false : false : false;
export declare type HasGen2<K extends GenTypesShapeKeys, K2 extends Extract<keyof GenTypesShape[K], string>> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? K extends keyof GenTypes ? K2 extends keyof GenTypes[K] ? true : false : false : false : false;
export declare type HasGen3<K extends GenTypesShapeKeys, K2 extends Extract<keyof GenTypesShape[K], string>, K3 extends Extract<keyof GenTypesShape[K][K2], string>> = EngramGen extends infer GenTypes ? GenTypes extends GenTypesShape ? K extends keyof GenTypes ? K2 extends keyof GenTypes[K] ? K3 extends keyof GenTypes[K][K2] ? true : false : false : false : false : false;
export declare type RootValue<TypeName extends string> = GetGen2<'rootTypes', TypeName>;
export declare type RootValueField<TypeName extends string, FieldName extends string> = GetGen3<'rootTypes', TypeName, FieldName>;
export declare type ArgsValue<TypeName extends string, FieldName extends string> = HasGen3<'fieldTypes', TypeName, FieldName> extends true ? GetGen3<'argTypes', TypeName, FieldName, {}> : any;
export declare type ResultValue<TypeName extends string, FieldName extends string> = GetGen3<'fieldTypes', TypeName, FieldName>;
export declare type NeedsResolver<TypeName extends string, FieldName extends string> = HasGen3<'fieldTypes', TypeName, FieldName> extends true ? null extends GetGen3<'fieldTypes', TypeName, FieldName> ? false : HasGen3<'rootTypes', TypeName, FieldName> extends true ? null extends GetGen3<'rootTypes', TypeName, FieldName> ? true : false : true : HasGen3<'rootTypes', TypeName, FieldName> extends true ? null extends GetGen3<'rootTypes', TypeName, FieldName> ? true : false : false;
