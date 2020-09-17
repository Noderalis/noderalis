import { GraphQLNamedType } from 'graphql';
import { DynamicInputMethodDef, DynamicOutputMethodDef } from '../dynamicMethod';
import { DynamicOutputPropertyDef } from '../dynamicProperty';
import { EngramPlugin } from '../plugin';
import { AllInputTypes } from '../typegenTypeHelpers';
import { PrintedGenTyping, PrintedGenTypingImport } from '../utils';
import { EngramArgDef } from './args';
import { EngramEnumTypeDef } from './enumType';
import { EngramExtendInputTypeDef } from './extendInputType';
import { EngramExtendTypeDef } from './extendType';
import { EngramInputObjectTypeDef } from './inputObjectType';
import { EngramInterfaceTypeDef } from './interfaceType';
import { EngramObjectTypeDef } from './objectType';
import { EngramScalarTypeDef } from './scalarType';
import { EngramUnionTypeDef } from './unionType';
import { EngramTypes, EngramWrappedSymbol } from './_types';
export declare type AllEngramInputTypeDefs<T extends string = any> = EngramInputObjectTypeDef<T> | EngramEnumTypeDef<T> | EngramScalarTypeDef<T>;
export declare type AllEngramOutputTypeDefs = EngramObjectTypeDef<any> | EngramInterfaceTypeDef<any> | EngramUnionTypeDef<any> | EngramEnumTypeDef<any> | EngramScalarTypeDef<any>;
export declare type AllEngramNamedTypeDefs = AllEngramInputTypeDefs | AllEngramOutputTypeDefs;
export declare type AllTypeDefs = AllEngramInputTypeDefs | AllEngramOutputTypeDefs | GraphQLNamedType;
export declare const isEngramTypeDef: (obj: any) => obj is {
    [EngramWrappedSymbol]: EngramTypes;
};
export declare function isEngramStruct(obj: any): obj is {
    [EngramWrappedSymbol]: EngramTypes;
};
export declare function isEngramNamedTypeDef(obj: any): obj is AllEngramNamedTypeDefs;
export declare function isEngramExtendInputTypeDef(obj: any): obj is EngramExtendInputTypeDef<string>;
export declare function isEngramExtendTypeDef(obj: any): obj is EngramExtendTypeDef<string>;
export declare function isEngramEnumTypeDef(obj: any): obj is EngramEnumTypeDef<string>;
export declare function isEngramInputObjectTypeDef(obj: any): obj is EngramInputObjectTypeDef<string>;
export declare function isEngramObjectTypeDef(obj: any): obj is EngramObjectTypeDef<string>;
export declare function isEngramScalarTypeDef(obj: any): obj is EngramScalarTypeDef<string>;
export declare function isEngramUnionTypeDef(obj: any): obj is EngramUnionTypeDef<string>;
export declare function isEngramInterfaceTypeDef(obj: any): obj is EngramInterfaceTypeDef<string>;
export declare function isEngramArgDef(obj: any): obj is EngramArgDef<AllInputTypes>;
export declare function isEngramDynamicOutputProperty<T extends string>(obj: any): obj is DynamicOutputPropertyDef<T>;
export declare function isEngramDynamicOutputMethod<T extends string>(obj: any): obj is DynamicOutputMethodDef<T>;
export declare function isEngramDynamicInputMethod<T extends string>(obj: any): obj is DynamicInputMethodDef<T>;
export declare function isEngramPrintedGenTyping(obj: any): obj is PrintedGenTyping;
export declare function isEngramPrintedGenTypingImport(obj: any): obj is PrintedGenTypingImport;
export declare function isEngramPlugin(obj: any): obj is EngramPlugin;