import {
  __Schema,
  __Type,
  __TypeKind,
  __Field,
  __InputValue,
  __EnumValue,
  __Directive,
  __DirectiveLocation
} from "graphql";

export const config = {
  description: undefined,
  query: Query,
  mutation: undefined,
  subscription: undefined,
  types: [
    Post,
    Int,
    String,
    Boolean,
    Query,
    __Schema,
    __Type,
    __TypeKind,
    __Field,
    __InputValue,
    __EnumValue,
    __Directive,
    __DirectiveLocation
  ],
  // directives was here
  extensions:  {
    engram: EngramSchemaExtension { config: [Object] }
  },
  astNode: undefined,
  extensionASTNodes: [],
  assumeValid: false
}