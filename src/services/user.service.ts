import { createUserRepository } from '../repositories/user.repository';
import { NewUserEntity, UserRequest } from '../schemas/user-schema.schema';
import { asyncHashPassword } from '../utils/hashPassword.utils';
import { generateUUIDv7 } from '../utils/uuidgenerator.utils';

export async function createUserService(
	requestData: UserRequest
): Promise<string> {
	try {
		const userUUID = generateUUIDv7();
		const hashedPassword = await asyncHashPassword(requestData.password);

		const userEntity = <NewUserEntity>{
			user_id: userUUID,
			user_name: requestData.user_name,
			email: requestData.email,
			password: hashedPassword,
		};

		await createUserRepository(userEntity);

		return 'Created successfully';
	} catch (error) {
		// TODO: Add proper logger and typed error handler
		console.log('Service Error', error);
		throw new Error('Failed to create user. Please try again later.');
	}
}
