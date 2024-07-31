import { FastifyReply, FastifyRequest } from 'fastify';
import { decodeAccessToken } from '../utils/decode-token.utils';

export async function authMiddleware(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		// Bearer TOKEN
		const accessToken = request.headers.authorization?.split(' ')[1];

		if (!accessToken) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const decodedAccessToken = decodeAccessToken(accessToken);
		if (!decodedAccessToken) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}
	} catch (error) {
		reply.code(401).send({ message: 'Unauthorized' });
	}
}
