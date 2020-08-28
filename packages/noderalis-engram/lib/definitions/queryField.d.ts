import { FieldOutConfig, OutputDefinitionBlock } from '../core';
import { EngramExtendTypeDef } from './extendType';
export declare type QueryFieldConfig<FieldName extends string> = FieldOutConfig<'Query', FieldName> | (() => FieldOutConfig<'Query', FieldName>);
export declare function queryField(fieldFn: (t: OutputDefinitionBlock<'Query'>) => void): EngramExtendTypeDef<'Query'>;
export declare function queryField<FieldName extends string>(fieldName: FieldName, config: QueryFieldConfig<FieldName>): EngramExtendTypeDef<'Query'>;
