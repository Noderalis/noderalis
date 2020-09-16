import { OutputDefinitionBlock } from '../blocks';
import { FieldOutConfig } from './definitionBlocks';
import { extendType, EngramExtendTypeDef } from './extendType';

export type QueryFieldConfig<FieldName extends string> =
	| FieldOutConfig<'Query', FieldName>
	| (() => FieldOutConfig<'Query', FieldName>);

export function queryField(
	fieldFn: (t: OutputDefinitionBlock<'Query'>) => void
): EngramExtendTypeDef<'Query'>;

export function queryField<FieldName extends string>(
	fieldName: FieldName,
	config: QueryFieldConfig<FieldName>
): EngramExtendTypeDef<'Query'>;

export function queryField(...args: any[]) {
	return extendType({
		type: 'Query',
		definition(t) {
			if (typeof args[0] === 'function') {
				return args[0](t);
			}
			const [fieldName, config] = args as [string, QueryFieldConfig<any>];
			const finalConfig = typeof config === 'function' ? config() : config;
			t.field(fieldName, finalConfig);
		},
	});
}
