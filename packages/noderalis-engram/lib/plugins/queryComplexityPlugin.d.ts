import { GraphQLField } from 'graphql';
import { ArgsValue, GetGen, RootValue } from '../core';
export declare type QueryComplexityEstimatorArgs<TypeName extends string, FieldName extends string> = {
    type: RootValue<TypeName>;
    field: GraphQLField<RootValue<TypeName>, GetGen<'context'>, ArgsValue<TypeName, FieldName>>;
    args: ArgsValue<TypeName, FieldName>;
    childComplexity: number;
};
export declare type QueryComplexityEstimator<TypeName extends string, FieldName extends string> = (options: QueryComplexityEstimatorArgs<TypeName, FieldName>) => number | void;
export declare type QueryComplexity<TypeName extends string, FieldName extends string> = number | QueryComplexityEstimator<TypeName, FieldName>;
export declare const queryComplexityPlugin: () => import("../plugin").EngramPlugin;
