import { GraphQLResolveInfo } from 'graphql';
import { ArgsValue, FieldResolver, GetGen, HasGen3, MaybePromise, MaybePromiseDeep, NeedsResolver, ResultValue } from '../typegenTypeHelpers';
import { CommonOutputFieldConfig } from './definitionBlocks';
import { ObjectDefinitionBlock, ObjectDefinitionBuilder } from './objectType';
import { AllEngramOutputTypeDefs } from './wrapping';
export interface SubscriptionScalarConfig<TypeName extends string, FieldName extends string, T = any> extends CommonOutputFieldConfig<TypeName, FieldName> {
    /**
     * Resolve method for the field
     */
    resolve?: FieldResolver<TypeName, FieldName>;
    subscribe(root: object, args: ArgsValue<TypeName, FieldName>, ctx: GetGen<'context'>, info: GraphQLResolveInfo): MaybePromise<AsyncIterator<T>> | MaybePromiseDeep<AsyncIterator<T>>;
}
export declare type ScalarSubSpread<TypeName extends string, FieldName extends string> = NeedsResolver<TypeName, FieldName> extends true ? HasGen3<'argTypes', TypeName, FieldName> extends true ? [ScalarSubConfig<TypeName, FieldName>] : [ScalarSubConfig<TypeName, FieldName>] | [FieldResolver<TypeName, FieldName>] : HasGen3<'argTypes', TypeName, FieldName> extends true ? [ScalarSubConfig<TypeName, FieldName>] : [] | [FieldResolver<TypeName, FieldName>] | [ScalarSubConfig<TypeName, FieldName>];
export declare type ScalarSubConfig<TypeName extends string, FieldName extends string> = NeedsResolver<TypeName, FieldName> extends true ? SubscriptionScalarConfig<TypeName, FieldName> & {
    resolve: FieldResolver<TypeName, FieldName>;
} : SubscriptionScalarConfig<TypeName, FieldName>;
export interface SubscribeFieldConfig<TypeName extends string, FieldName extends string, T = any> extends CommonOutputFieldConfig<TypeName, FieldName> {
    type: GetGen<'allOutputTypes'> | AllEngramOutputTypeDefs;
    /**
     * Resolve method for the field
     */
    resolve(root: T, args: ArgsValue<TypeName, FieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo): MaybePromise<ResultValue<'Subscription', FieldName>> | MaybePromiseDeep<ResultValue<'Subscription', FieldName>>;
    subscribe(root: object, args: ArgsValue<TypeName, FieldName>, ctx: GetGen<'context'>, info: GraphQLResolveInfo): MaybePromise<AsyncIterator<T>> | MaybePromiseDeep<AsyncIterator<T>>;
}
export interface SubscriptionDefinitionBuilder extends ObjectDefinitionBuilder<'Subscription'> {
}
export declare class SubscriptionDefinitionBlock extends ObjectDefinitionBlock<'Subscription'> {
    protected typeBuilder: SubscriptionDefinitionBuilder;
    protected isList: boolean;
    constructor(typeBuilder: SubscriptionDefinitionBuilder, isList?: boolean);
    get list(): SubscriptionDefinitionBlock;
    string<FieldName extends string>(fieldName: FieldName, ...opts: ScalarSubSpread<'Subscription', FieldName>): void;
    int<FieldName extends string>(fieldName: FieldName, ...opts: ScalarSubSpread<'Subscription', FieldName>): void;
    boolean<FieldName extends string>(fieldName: FieldName, ...opts: ScalarSubSpread<'Subscription', FieldName>): void;
    id<FieldName extends string>(fieldName: FieldName, ...opts: ScalarSubSpread<'Subscription', FieldName>): void;
    float<FieldName extends string>(fieldName: FieldName, ...opts: ScalarSubSpread<'Subscription', FieldName>): void;
    field<FieldName extends string>(name: FieldName, fieldConfig: SubscribeFieldConfig<'Subscription', FieldName>): void;
}
export declare type EngramSubscriptionTypeConfig = {
    name: 'Subscription';
    definition(t: SubscriptionDefinitionBlock): void;
};
export declare function subscriptionType(config: Omit<EngramSubscriptionTypeConfig, 'name'>): import("./objectType").EngramObjectTypeDef<"Subscription">;
