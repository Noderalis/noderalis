import { GraphQLNamedType } from 'graphql';
import {
	DynamicInputMethodDef,
	DynamicOutputMethodDef,
} from '../dynamicMethod';
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

export type AllEngramInputTypeDefs<T extends string = any> =
	| EngramInputObjectTypeDef<T>
	| EngramEnumTypeDef<T>
	| EngramScalarTypeDef<T>;

export type AllEngramOutputTypeDefs =
	| EngramObjectTypeDef<any>
	| EngramInterfaceTypeDef<any>
	| EngramUnionTypeDef<any>
	| EngramEnumTypeDef<any>
	| EngramScalarTypeDef<any>;

export type AllEngramNamedTypeDefs =
	| AllEngramInputTypeDefs
	| AllEngramOutputTypeDefs;

export type AllTypeDefs =
	| AllEngramInputTypeDefs
	| AllEngramOutputTypeDefs
	| GraphQLNamedType;

const NamedTypeDefs = new Set([
	EngramTypes.Enum,
	EngramTypes.Object,
	EngramTypes.Scalar,
	EngramTypes.Union,
	EngramTypes.Interface,
	EngramTypes.InputObject,
]);

export const isEngramTypeDef = (
	obj: any
): obj is { [EngramWrappedSymbol]: EngramTypes } => {
	console.warn(`isEngramTypeDef is deprecated, use isEngramStruct`);
	return isEngramStruct(obj);
};

export function isEngramStruct(
	obj: any
): obj is { [EngramWrappedSymbol]: EngramTypes } {
	return obj && Boolean(obj[EngramWrappedSymbol]);
}
export function isEngramNamedTypeDef(obj: any): obj is AllEngramNamedTypeDefs {
	return isEngramStruct(obj) && NamedTypeDefs.has(obj[EngramWrappedSymbol]);
}
export function isEngramExtendInputTypeDef(
	obj: any
): obj is EngramExtendInputTypeDef<string> {
	return (
		isEngramStruct(obj) &&
		obj[EngramWrappedSymbol] === EngramTypes.ExtendInputObject
	);
}
export function isEngramExtendTypeDef(
	obj: any
): obj is EngramExtendTypeDef<string> {
	return (
		isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.ExtendObject
	);
}

export function isEngramEnumTypeDef(
	obj: any
): obj is EngramEnumTypeDef<string> {
	return isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Enum;
}
export function isEngramInputObjectTypeDef(
	obj: any
): obj is EngramInputObjectTypeDef<string> {
	return (
		isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.InputObject
	);
}
export function isEngramObjectTypeDef(
	obj: any
): obj is EngramObjectTypeDef<string> {
	return isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Object;
}
export function isEngramScalarTypeDef(
	obj: any
): obj is EngramScalarTypeDef<string> {
	return isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Scalar;
}
export function isEngramUnionTypeDef(
	obj: any
): obj is EngramUnionTypeDef<string> {
	return isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Union;
}
export function isEngramInterfaceTypeDef(
	obj: any
): obj is EngramInterfaceTypeDef<string> {
	return (
		isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Interface
	);
}
export function isEngramArgDef(obj: any): obj is EngramArgDef<AllInputTypes> {
	return isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Arg;
}

export function isEngramDynamicOutputProperty<T extends string>(
	obj: any
): obj is DynamicOutputPropertyDef<T> {
	return (
		isEngramStruct(obj) &&
		obj[EngramWrappedSymbol] === EngramTypes.DynamicOutputProperty
	);
}
export function isEngramDynamicOutputMethod<T extends string>(
	obj: any
): obj is DynamicOutputMethodDef<T> {
	return (
		isEngramStruct(obj) &&
		obj[EngramWrappedSymbol] === EngramTypes.DynamicOutputMethod
	);
}
export function isEngramDynamicInputMethod<T extends string>(
	obj: any
): obj is DynamicInputMethodDef<T> {
	return (
		isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.DynamicInput
	);
}
export function isEngramPrintedGenTyping(obj: any): obj is PrintedGenTyping {
	return (
		isEngramStruct(obj) &&
		obj[EngramWrappedSymbol] === EngramTypes.PrintedGenTyping
	);
}
export function isEngramPrintedGenTypingImport(
	obj: any
): obj is PrintedGenTypingImport {
	return (
		isEngramStruct(obj) &&
		obj[EngramWrappedSymbol] === EngramTypes.PrintedGenTypingImport
	);
}

export function isEngramPlugin(obj: any): obj is EngramPlugin {
	return isEngramStruct(obj) && obj[EngramWrappedSymbol] === EngramTypes.Plugin;
}
