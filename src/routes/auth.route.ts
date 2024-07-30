import { FastifyInstance } from 'fastify';
import {
	signInAuthController,
	signupAuthController,
} from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post('/signup', signupAuthController);
	fastify.post('/signin', signInAuthController);
}
