import dotenv from 'dotenv';

dotenv.config();
import bcrypt from 'bcrypt';

export async function asyncHashPassword(
	plainPassword: string
): Promise<string | undefined> {
	if (!process.env.SALT_ROUNDS) return;

	const saltRounds = parseInt(process.env.SALT_ROUNDS);
	return await bcrypt.hash(plainPassword, saltRounds);
}

export async function asyncHashValues(
	plainString: string
): Promise<string | undefined> {
	if (!process.env.SALT_ROUNDS) return;

	// TODO: decide if set up salt rounds as arg param
	const saltRounds = parseInt(process.env.SALT_ROUNDS);
	return await bcrypt.hash(plainString, saltRounds);
}
