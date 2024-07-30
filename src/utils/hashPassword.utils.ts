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
