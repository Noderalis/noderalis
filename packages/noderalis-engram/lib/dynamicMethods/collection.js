"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionFieldMethod = void 0;
const args_1 = require("../definitions/args");
const objectType_1 = require("../definitions/objectType");
const dynamicMethod_1 = require("../dynamicMethod");
const basicCollectionMap = new Map();
exports.CollectionFieldMethod = dynamicMethod_1.dynamicOutputMethod({
    name: 'collectionField',
    typeDefinition: `<FieldName extends string>(fieldName: FieldName, opts: {
      type: EngramGenObjectNames | EngramGenInterfaceNames | core.EngramObjectTypeDef<any> | core.EngramInterfaceTypeDef<any>,
      nodes: core.SubFieldResolver<TypeName, FieldName, "nodes">,
      totalCount: core.SubFieldResolver<TypeName, FieldName, "totalCount">,
      args?: core.ArgsRecord,
      nullable?: boolean,
      description?: string
    }): void;`,
    factory({ typeDef: t, args: [fieldName, config] }) {
        /* istanbul ignore next */
        if (!config.type) {
            throw new Error(`Missing required property "type" from collectionField ${fieldName}`);
        }
        const typeName = typeof config.type === 'string' ? config.type : config.type.name;
        /* istanbul ignore next */
        if (config.list) {
            throw new Error(`Collection field ${fieldName}.${typeName} cannot be used as a list.`);
        }
        if (!basicCollectionMap.has(typeName)) {
            basicCollectionMap.set(typeName, objectType_1.objectType({
                name: `${typeName}Collection`,
                definition(c) {
                    c.int('totalCount');
                    c.list.field('nodes', { type: config.type });
                },
            }));
        }
        t.field(fieldName, {
            type: basicCollectionMap.get(typeName),
            args: config.args || {
                page: args_1.intArg(),
                perPage: args_1.intArg(),
            },
            nullable: config.nullable,
            description: config.description,
            resolve(root, args, ctx, info) {
                const nodesResolver = (...fArgs) => config.nodes(root, args, ctx, fArgs[3]);
                const totalCountResolver = (...fArgs) => config.totalCount(root, args, ctx, fArgs[3]);
                return {
                    nodes: nodesResolver,
                    totalCount: totalCountResolver,
                };
            },
        });
    },
});
