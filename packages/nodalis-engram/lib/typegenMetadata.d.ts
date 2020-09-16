import { GraphQLSchema } from 'graphql';
import { BuilderConfig, TypegenInfo } from './builder';
import { EngramGraphQLSchema } from './definitions/_types';
export interface TypegenMetadataConfig extends Omit<BuilderConfig, 'outputs' | 'shouldGenerateArtifacts'> {
    engramSchemaImportId?: string;
    outputs: {
        schema: false | string;
        typegen: false | string;
    };
}
/**
 * Passed into the SchemaBuilder, this keeps track of any necessary
 * field / type metadata we need to be aware of when building the
 * generated types and/or SDL artifact, including but not limited to:
 */
export declare class TypegenMetadata {
    protected config: TypegenMetadataConfig;
    constructor(config: TypegenMetadataConfig);
    /**
     * Generates the artifacts of the build based on what we
     * know about the schema and how it was defined.
     */
    generateArtifacts(schema: EngramGraphQLSchema): Promise<void>;
    generateArtifactContents(schema: EngramGraphQLSchema, typeFilePath: string | false): Promise<{
        schemaTypes: string;
        tsTypes: string;
    }>;
    sortSchema(schema: EngramGraphQLSchema): EngramGraphQLSchema;
    writeFile(type: 'schema' | 'types', output: string, filePath: string): Promise<void>;
    /**
     * Generates the schema, adding any directives as necessary
     */
    generateSchemaFile(schema: GraphQLSchema): string;
    /**
     * Generates the type definitions
     */
    generateTypesFile(schema: EngramGraphQLSchema, typegenFile: string): Promise<string>;
    getTypegenInfo(schema: GraphQLSchema): Promise<TypegenInfo>;
}
