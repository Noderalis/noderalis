import fastify, { FastifyInstance } from 'fastify';

const Server: FastifyInstance = fastify({ logger: true });

Server.route({
	method: 'GET',
	url: '/',
	schema: {
		querystring: {
			name: { type: 'string' },
		},
		response: {
			200: {
				type: 'object',
				properties: {
					hello: {
						type: 'string',
					},
				},
			},
		},
	},
	preHandler: async (request, reply) => {},
	handler: async (request, reply) => {
		return { hello: 'World!' };
	},
});

const start = async () => {
	try {
		await Server.listen(3000);
		Server.log.info(`Server listening on ${Server.server.address()}`);
	} catch (err) {
		Server.log.error(err);
		process.exit(1);
	}
};

start();
