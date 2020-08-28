import { RouteOptions } from 'fastify';
import { Server } from './Server';

export type BaseContext = {
	typed: string;
};

export abstract class Route<Context extends BaseContext> {
	static Get(opts: Omit<RouteOptions, 'handler' | 'method'>): MethodDecorator {
		return (target, propertyKey, descriptor: PropertyDescriptor) => {
			new Server().server.route({
				method: 'GET',
				url: opts.url!,
				handler: descriptor.value,
			});
		};
	}

	static Post(descriptor: string) {
		return <Context extends BaseContext>(
			prototype: Route<Context>,
			propertyName: string
		) => {};
	}

	static createHandler(...opts: any): unknown {
		return opts;
	}
}

export type HomeContext = BaseContext & {
	testy: string;
};

export class HomeRoute extends Route<HomeContext> {
	@Route.Get({ url: '/' })
	getHome() {
		return { hello: 'World!' };
	}

	@Route.Get({ url: '/' })
	getHome2 = Route.createHandler((request, reply) => {
		return { hello: 'World!' }; // ... do something
	});
}
