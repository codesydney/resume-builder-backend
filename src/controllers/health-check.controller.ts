import { FastifyReply, FastifyRequest } from 'fastify';

export async function healthCheckController(
	request: FastifyRequest,
	reply: FastifyReply
): Promise<void> {
	reply.code(200).send({ message: 'Server is alive!' });
}
