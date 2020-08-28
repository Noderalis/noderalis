import { EngramGraphQLSchema } from './definitions/_types';
import { TypegenMetadata } from './typegenMetadata';
import { resolveTypegenConfig } from './typegenUtils';
import { assertNoMissingTypes, objValues } from './utils';
import { SchemaBuilder, SchemaConfig } from './builder';
import { isObjectType, GraphQLSchema } from 'graphql';

/**
 * Builds the schema, we may return more than just the schema
 * from this one day.
 */
export function makeSchemaInternal(config: SchemaConfig) {
	const builder = new SchemaBuilder(config);
	builder.addTypes(config.types);
	const {
		finalConfig,
		typeMap,
		missingTypes,
		schemaExtension,
		onAfterBuildFns,
	} = builder.getFinalTypeMap();
	const { Query, Mutation, Subscription } = typeMap;

	/* istanbul ignore next */
	if (!isObjectType(Query)) {
		throw new Error(
			`Expected Query to be a objectType, saw ${Query.constructor.name}`
		);
	}
	/* istanbul ignore next */
	if (Mutation && !isObjectType(Mutation)) {
		throw new Error(
			`Expected Mutation to be a objectType, saw ${Mutation.constructor.name}`
		);
	}
	/* istanbul ignore next */
	if (Subscription && !isObjectType(Subscription)) {
		throw new Error(
			`Expected Subscription to be a objectType, saw ${Subscription.constructor.name}`
		);
	}

	const schema = new GraphQLSchema({
		query: Query,
		mutation: Mutation,
		subscription: Subscription,
		types: objValues(typeMap),
		extensions: {
			engram: schemaExtension,
		},
	}) as EngramGraphQLSchema;

	onAfterBuildFns.forEach((fn) => fn(schema));

	return { schema, missingTypes, finalConfig };
}

/**
 * Defines the GraphQL schema, by combining the GraphQL types defined
 * by the GraphQL Engram layer or any manually defined GraphQLType objects.
 *
 * Requires at least one type be named "Query", which will be used as the
 * root query type.
 */

export function makeSchema(config: SchemaConfig): EngramGraphQLSchema {
	const { schema, missingTypes, finalConfig } = makeSchemaInternal(config);
	const typegenConfig = resolveTypegenConfig(finalConfig);
	if (typegenConfig.outputs.schema || typegenConfig.outputs.typegen) {
		// Generating in the next tick allows us to use the schema
		// in the optional thunk for the typegen config
		const typegenPromise = new TypegenMetadata(typegenConfig).generateArtifacts(
			schema
		);
		if (config.shouldExitAfterGenerateArtifacts) {
			typegenPromise
				.then(() => {
					console.log(`Generated Artifacts:
          TypeScript Types  ==> ${
						typegenConfig.outputs.typegen || '(not enabled)'
					}
          GraphQL Schema    ==> ${
						typegenConfig.outputs.schema || '(not enabled)'
					}`);
					process.exit(0);
				})
				.catch((e) => {
					console.error(e);
					process.exit(1);
				});
		} else {
			typegenPromise.catch((e) => {
				console.error(e);
			});
		}
	}
	assertNoMissingTypes(schema, missingTypes);
	return schema;
}
