import { FastifyInstance } from 'fastify';
import { createUserController } from '../controllers/user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
	// Create Event
	fastify.post('/create-user', createUserController);
}
