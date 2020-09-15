import { IdleValue } from './async';
import { SyncDescriptor } from './descriptors';
import { Graph } from './graph';
import {
	IInstantiationService,
	optional,
	ServiceIdentifier,
	ServicesAccessor,
	_util,
} from './instantiation';
import { ServiceCollection } from './main';

class CyclicDependencyError extends Error {
	constructor(graph: Graph<any>) {
		super('cyclic dependency between services');
		this.message = graph.toString();
	}
}

export class InstantiationService implements IInstantiationService {
	declare readonly _serviceBrand: undefined;

	private readonly _services: ServiceCollection;
	private readonly _parent?: InstantiationService;

	constructor(
		services: ServiceCollection = new ServiceCollection(),
		parent?: InstantiationService
	) {
		this._services = services;
		this._parent = parent;

		this._services.set(IInstantiationService, this);
	}

	invokeFunction<R, TS extends any[] = []>(
		fn: (accessor: ServicesAccessor, ...args: TS) => R,
		...args: TS
	): R {
		let _done = false;
		try {
			const accessor: ServicesAccessor = {
				get: <T>(id: ServiceIdentifier<T>, isOptional?: typeof optional) => {
					if (_done)
						throw new Error(`Something went wrong in "invokeFunction"!`);

					const result = this._getOrCreateServiceInstance(id);

					return result;
				},
			};

			return fn(accessor, ...args);
		} finally {
			_done = true;
		}
	}

	createInstance(
		ctorOrDescriptor: any | SyncDescriptor<any>,
		...rest: any[]
	): any {
		let result: any;
		if (ctorOrDescriptor instanceof SyncDescriptor) {
			result = this._createInstance(
				ctorOrDescriptor.ctor,
				ctorOrDescriptor.staticArguments.concat(rest)
			);
		} else {
			result = this._createInstance(ctorOrDescriptor, rest);
		}

		return result;
	}

	private _createInstance<T>(ctor: any, args: any[] = []): T {
		// arguments defined by service decorators
		let serviceDependencies = _util
			.getServiceDependencies(ctor)
			.sort((a, b) => a.index - b.index);
		let serviceArgs: any[] = [];
		for (const dependency of serviceDependencies) {
			let service = this._getOrCreateServiceInstance(dependency.id);

			serviceArgs.push(service);
		}

		let firstServiceArgPos =
			serviceDependencies.length > 0
				? serviceDependencies[0].index
				: args.length;

		// check for argument mismatches, adjust static args if needed
		if (args.length !== firstServiceArgPos) {
			console.warn(
				`[createInstance] First service dependency of ${
					ctor.name
				} at position ${firstServiceArgPos + 1} conflicts with ${
					args.length
				} static arguments`
			);

			let delta = firstServiceArgPos - args.length;
			if (delta > 0) {
				args = args.concat(new Array(delta));
			} else {
				args = args.slice(0, firstServiceArgPos);
			}
		}

		// now create the instance
		return <T>new ctor(...[...args, ...serviceArgs]);
	}

	private _setServiceInstance<T>(id: ServiceIdentifier<T>, instance: T): void {
		if (this._services.get(id) instanceof SyncDescriptor) {
			this._services.set(id, instance);
		} else if (this._parent) {
			this._parent._setServiceInstance(id, instance);
		} else {
			throw new Error('illegalState - setting UNKNOWN service instance');
		}
	}

	private _getServiceInstanceOrDescriptor<T>(
		id: ServiceIdentifier<T>
	): T | SyncDescriptor<T> {
		let instanceOrDesc = this._services.get(id);
		if (!instanceOrDesc && this._parent) {
			return this._parent._getServiceInstanceOrDescriptor(id);
		} else {
			return instanceOrDesc;
		}
	}

	private _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>): T {
		let thing = this._getServiceInstanceOrDescriptor(id);
		if (thing instanceof SyncDescriptor) {
			return this._createAndCacheServiceInstance(id, thing);
		} else {
			return thing;
		}
	}

	private _createAndCacheServiceInstance<T>(
		id: ServiceIdentifier<T>,
		desc: SyncDescriptor<T>
	): T {
		type Triple = { id: ServiceIdentifier<any>; desc: SyncDescriptor<any> };
		const graph = new Graph<Triple>((data) => data.id.toString());

		let cycleCount = 0;
		const stack = [{ id, desc }];
		while (stack.length) {
			const item = stack.pop()!;
			graph.lookupOrInsertNode(item);

			// a weak but working heuristic for cycle checks
			if (cycleCount++ > 1000) {
				throw new CyclicDependencyError(graph);
			}

			// check all dependencies for existence and if they need to be created first
			for (let dependency of _util.getServiceDependencies(item.desc.ctor)) {
				let instanceOrDesc = this._getServiceInstanceOrDescriptor(
					dependency.id
				);
				if (!instanceOrDesc && !dependency.optional) {
					console.warn(
						`[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`
					);
				}

				if (instanceOrDesc instanceof SyncDescriptor) {
					const d = { id: dependency.id, desc: instanceOrDesc };
					graph.insertEdge(item, d);
					stack.push(d);
				}
			}
		}

		while (true) {
			const roots = graph.roots();

			// if there is no more roots but still
			// nodes in the graph we have a cycle
			if (roots.length === 0) {
				if (!graph.isEmpty()) {
					throw new CyclicDependencyError(graph);
				}
				break;
			}

			for (const { data } of roots) {
				// create instance and overwrite the service collections
				const instance = this._createServiceInstanceWithOwner(
					data.id,
					data.desc.ctor,
					data.desc.staticArguments,
					data.desc.supportsDelayedInstantiation
				);
				this._setServiceInstance(data.id, instance);
				graph.removeNode(data);
			}
		}

		return <T>this._getServiceInstanceOrDescriptor(id);
	}

	private _createServiceInstanceWithOwner<T>(
		id: ServiceIdentifier<T>,
		ctor: any,
		args: any[] = [],
		supportsDelayedInstantiation: boolean
	): T {
		if (this._services.get(id) instanceof SyncDescriptor) {
			return this._createServiceInstance(
				ctor,
				args,
				supportsDelayedInstantiation
			);
		} else if (this._parent) {
			return this._parent._createServiceInstanceWithOwner(
				id,
				ctor,
				args,
				supportsDelayedInstantiation
			);
		} else {
			throw new Error(
				`illegalState - creating UNKNOWN service instance ${ctor.name}`
			);
		}
	}

	private _createServiceInstance<T>(
		ctor: any,
		args: any[] = [],
		_supportsDelayedInstantiation: boolean
	): T {
		if (!_supportsDelayedInstantiation) {
			// eager instantiation
			return this._createInstance(ctor, args);
		} else {
			// Return a proxy object that's backed by an idle value. That
			// strategy is to instantiate services in our idle time or when actually
			// needed but not when injected into a consumer
			const idle = new IdleValue<any>(() =>
				this._createInstance<T>(ctor, args)
			);
			return <T>new Proxy(Object.create(null), {
				get(target: any, key: PropertyKey): any {
					if (key in target) {
						return target[key];
					}
					let obj = idle.value;
					let prop = obj[key];
					if (typeof prop !== 'function') {
						return prop;
					}
					prop = prop.bind(obj);
					target[key] = prop;
					return prop;
				},
				set(_target: T, p: PropertyKey, value: any): boolean {
					idle.value[p] = value;
					return true;
				},
			});
		}
	}

	createChild(services: ServiceCollection): IInstantiationService {
		return new InstantiationService(services, this);
	}
}
