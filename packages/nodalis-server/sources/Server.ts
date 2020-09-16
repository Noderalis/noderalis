import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';

export class Server {
	private _server: FastifyInstance;

	constructor(opts?: FastifyServerOptions) {
		console.log('created server');

		this._server = Fastify({ logger: true });
	}

	public get server(): FastifyInstance {
		console.log('getting server');

		return this._server;
	}
}
