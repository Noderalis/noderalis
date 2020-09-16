import * as descriptors from './descriptors';
import { ServiceCollection } from './main';

export namespace _util {
	export const serviceIds = new Map<string, ServiceIdentifier<any>>();

	export const DI_TARGET = '$di$target';
	export const DI_DEPENDENCIES = '$di$dependencies';

	export function getServiceDependencies(
		ctor: any
	): { id: ServiceIdentifier<any>; index: number; optional: boolean }[] {
		return ctor[DI_DEPENDENCIES] || [];
	}
}

export interface ServicesAccessor {
	get<T>(id: ServiceIdentifier<T>): T;
	get<T>(id: ServiceIdentifier<T>, isOptional: typeof optional): T | undefined;
}

/**
 * Identifies a service of type T
 */
export interface ServiceIdentifier<T> {
	(...args: any[]): void;
	type: T;
}

export type BrandedService = { _serviceBrand: undefined };

/**
 * Given a list of arguments as a tuple, attempt to extract the leading, non-service arguments
 * to their own tuple.
 */
type GetLeadingNonServiceArgs<Args> = Args extends [...BrandedService[]]
	? []
	: Args extends [infer A1, ...BrandedService[]]
	? [A1]
	: Args extends [infer A1, infer A2, ...BrandedService[]]
	? [A1, A2]
	: Args extends [infer A1, infer A2, infer A3, ...BrandedService[]]
	? [A1, A2, A3]
	: Args extends [infer A1, infer A2, infer A3, infer A4, ...BrandedService[]]
	? [A1, A2, A3, A4]
	: Args extends [
			infer A1,
			infer A2,
			infer A3,
			infer A4,
			infer A5,
			...BrandedService[]
	  ]
	? [A1, A2, A3, A4, A5]
	: Args extends [
			infer A1,
			infer A2,
			infer A3,
			infer A4,
			infer A5,
			infer A6,
			...BrandedService[]
	  ]
	? [A1, A2, A3, A4, A5, A6]
	: Args extends [
			infer A1,
			infer A2,
			infer A3,
			infer A4,
			infer A5,
			infer A6,
			infer A7,
			...BrandedService[]
	  ]
	? [A1, A2, A3, A4, A5, A6, A7]
	: Args extends [
			infer A1,
			infer A2,
			infer A3,
			infer A4,
			infer A5,
			infer A6,
			infer A7,
			infer A8,
			...BrandedService[]
	  ]
	? [A1, A2, A3, A4, A5, A6, A7, A8]
	: never;

export const IInstantiationService = createDecorator<IInstantiationService>(
	'instantiationService'
);

export interface IInstantiationService {
	readonly _serviceBrand: undefined;

	/**
	 * Synchronously creates an instance that is denoted by
	 * the descriptor
	 */
	createInstance<A extends unknown[], T>(
		descriptor: descriptors.SyncDescriptor0<[...A], T>,
		...args: [...A]
	): T;

	createInstance<
		Ctor extends new (...args: any[]) => any,
		R extends InstanceType<Ctor>
	>(
		t: Ctor,
		...args: GetLeadingNonServiceArgs<ConstructorParameters<Ctor>>
	): R;

	/**
	 *
	 */
	invokeFunction<R, TS extends any[] = []>(
		fn: (accessor: ServicesAccessor, ...args: TS) => R,
		...args: TS
	): R;

	/**
	 * Creates a child of this service which inherts all current services
	 * and adds/overwrites the given services
	 */
	createChild(services: ServiceCollection): IInstantiationService;
}

function storeServiceDependency(
	id: Function,
	target: Function,
	index: number,
	optional: boolean
): void {
	if ((target as any)[_util.DI_TARGET] === target) {
		(target as any)[_util.DI_DEPENDENCIES].push({ id, index, optional });
	} else {
		(target as any)[_util.DI_DEPENDENCIES] = [{ id, index, optional }];
		(target as any)[_util.DI_TARGET] = target;
	}
}

/**
 * The *only* valid way to create a {{ServiceIdentifier}}.
 */
export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
	if (_util.serviceIds.has(serviceId)) {
		return _util.serviceIds.get(serviceId)!;
	}

	const id = <any>function (target: Function, key: string, index: number): any {
		if (arguments.length !== 3) {
			throw new Error(
				'@IServiceName-decorator can only be used to decorate a parameter'
			);
		}
		storeServiceDependency(id, target, index, false);
	};

	id.toString = () => serviceId;

	_util.serviceIds.set(serviceId, id);
	return id;
}

/**
 * Mark a service dependency as optional.
 */
export function optional<T>(serviceIdentifier: ServiceIdentifier<T>) {
	return function (target: Function, key: string, index: number) {
		if (arguments.length !== 3) {
			throw new Error(
				'@optional-decorator can only be used to decorate a parameter'
			);
		}
		storeServiceDependency(serviceIdentifier, target, index, true);
	};
}
