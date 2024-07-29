import { FastifyInstance } from 'fastify/types/instance';
import { healthCheckController } from '../controllers/health-check.controller';

export default async function healthCheckRoute(
	fastify: FastifyInstance
): Promise<void> {
	fastify.get('/health-check', healthCheckController);
}
