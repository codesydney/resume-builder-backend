import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import healthCheckRoute from './routes/health-check.route';

const server = fastify({ logger: true });

server.register(cors, {
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.register(multipart);

server.register(healthCheckRoute, { prefix: '/api/v1' });

// Start the server
async function start(): Promise<void> {
	try {
		await server.listen({ port: 3030 });
		console.log(`Server is running at http://localhost:3030`);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

start();
