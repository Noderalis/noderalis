"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayConnectionFieldMethod = void 0;
const args_1 = require("../definitions/args");
const objectType_1 = require("../definitions/objectType");
const dynamicMethod_1 = require("../dynamicMethod");
const relayConnectionMap = new Map();
let pageInfo;
exports.RelayConnectionFieldMethod = dynamicMethod_1.dynamicOutputMethod({
    name: 'relayConnectionField',
    typeDefinition: `<FieldName extends string>(fieldName: FieldName, opts: {
      type: EngramGenObjectNames | EngramGenInterfaceNames | core.EngramObjectTypeDef<any> | core.EngramInterfaceTypeDef<any>,
      edges: core.SubFieldResolver<TypeName, FieldName, "edges">,
      pageInfo: core.SubFieldResolver<TypeName, FieldName, "pageInfo">,
      args?: Record<string, core.EngramArgDef<any>>,
      nullable?: boolean,
      description?: string
    }): void
  `,
    factory({ typeDef: t, args: [fieldName, config] }) {
        /* istanbul ignore next */
        if (!config.type) {
            throw new Error(`Missing required property "type" from relayConnection field ${fieldName}`);
        }
        const typeName = typeof config.type === 'string' ? config.type : config.type.name;
        pageInfo =
            pageInfo ||
                objectType_1.objectType({
                    name: `ConnectionPageInfo`,
                    definition(p) {
                        p.boolean('hasNextPage');
                        p.boolean('hasPreviousPage');
                    },
                });
        /* istanbul ignore next */
        if (config.list) {
            throw new Error(`Collection field ${fieldName}.${typeName} cannot be used as a list.`);
        }
        if (!relayConnectionMap.has(typeName)) {
            relayConnectionMap.set(typeName, objectType_1.objectType({
                name: `${typeName}RelayConnection`,
                definition(c) {
                    c.list.field('edges', {
                        type: objectType_1.objectType({
                            name: `${typeName}Edge`,
                            definition(e) {
                                e.id('cursor');
                                e.field('node', { type: config.type });
                            },
                        }),
                    });
                    c.field('pageInfo', { type: pageInfo });
                },
            }));
        }
        t.field(fieldName, {
            type: relayConnectionMap.get(typeName),
            args: {
                first: args_1.intArg(),
                after: args_1.stringArg(),
                last: args_1.intArg(),
                before: args_1.stringArg(),
                ...config.args,
            },
            nullable: config.nullable,
            description: config.description,
            resolve(root, args, ctx, info) {
                const edgeResolver = (...fArgs) => config.edges(root, args, ctx, fArgs[3]);
                const pageInfoResolver = (...fArgs) => config.pageInfo(root, args, ctx, fArgs[3]);
                return {
                    edges: edgeResolver,
                    pageInfo: pageInfoResolver,
                };
            },
        });
    },
});
