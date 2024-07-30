import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRequest } from '../schemas/user-schema.schema';
import {
	signInUserAuthService,
	signupUserAuthService,
} from '../services/auth.service';

export async function signupAuthController(
	request: FastifyRequest<{
		Body: UserRequest;
	}>,
	reply: FastifyReply
): Promise<void> {
	try {
		const requestData = request.body;
		const resultMessage = await signupUserAuthService(requestData);
		reply.code(201).send({ message: resultMessage });
	} catch (error) {
		reply.code(500).send({ message: 'Error registering user' });
	}
}

export async function signInAuthController(
	request: FastifyRequest<{
		Body: UserRequest;
	}>,
	reply: FastifyReply
): Promise<void> {
	try {
		const requestData = request.body;
		const tokens = await signInUserAuthService(requestData);

		if (!tokens?.accessToken || !tokens.refreshToken) {
			reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(200).send({
			accessToken: tokens?.accessToken,
			refreshToken: tokens?.refreshToken,
		});
	} catch (error) {
		reply.code(500).send({ message: 'Error login user' });
	}
}
