import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { inspect } from 'util';
import { objectType, extendType, makeSchema } from '..';

const generatedSchemaPath = resolve(__dirname, 'generatedSchema.ts');
const generatedLogPath = resolve(__dirname, 'trace.log');

if (existsSync(generatedSchemaPath)) {
	unlinkSync(generatedSchemaPath);
}

if (existsSync(generatedLogPath)) {
	unlinkSync(generatedLogPath);
}

const Post = objectType({
	name: 'Post',
	definition: (t) => {
		t.int('id');
		t.string('title');
		t.string('body');
		t.boolean('published');
	},
});

const Query = extendType({
	type: 'Query',
	definition: (t) => {
		t.field('drafts', {
			type: Post,
			description: 'Returns a list of drafts.',
			list: true,
			resolve: (root, args, context, info) => {
				return [
					{
						id: 1,
						title: 'Patch Lane',
						body: 'S.F. Barkley',
						published: false,
					},
				];
			},
		});
	},
});

// No plugin support, no sources, no context. We're making this opinionated.
// No outputs, we're throwing it into a project-local folder to support workspaces.
const schema = makeSchema({
	types: { Query, Post },
	outputs: {
		schema: join(__dirname, 'generated/schema.graphql'),
		typegen: join(__dirname, 'generated/types.gen.ts'),
	},
});

// console.dir(schema, { colors: true, depth: Infinity });
writeFileSync(
	resolve(__dirname, 'generatedSchema.ts'),
	'import {\n  __Schema,\n  __Type,\n  __TypeKind,\n  __Field,\n  __InputValue,\n  __EnumValue,\n  __Directive,\n  __DirectiveLocation\n} from "graphql";\n' +
		'\nexport const config = ' +
		inspect(schema.toConfig())
			.replace('GraphQLSchema ', '')
			.replace(
				'directives: [ @include, @skip, @deprecated, @specifiedBy ],',
				'// directives was here'
			)
			.replace('[Object: null prototype]', '')
			.replace('[Object: null prototype]', '')
			.replace('[Object: null prototype]', ''),
	{
		encoding: 'utf-8',
	}
);
