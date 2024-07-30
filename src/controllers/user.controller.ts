import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRequest } from '../schemas/user-schema.schema';
import { createUserService } from '../services/user.service';

export async function createUserController(
	request: FastifyRequest<{
		Body: UserRequest;
	}>,
	reply: FastifyReply
) {
	try {
		const requestData = request.body;
		const response = await createUserService(requestData);
		reply.code(201).send({ message: response });
	} catch (error) {
		// TODO: Add proper logger and typed error handler
		console.log('Controller Error', error);
		reply
			.code(500)
			.send({ message: 'Failed to create user. Please try again later.' });
	}
}
