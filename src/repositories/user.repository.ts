import { sql } from 'drizzle-orm';
import { db } from '../db/db';
import {
	NewUserEntity,
	UserEntity,
	users,
} from '../schemas/user-schema.schema';

export async function createUserRepository(userEntity: NewUserEntity) {
	return db?.insert(users).values(userEntity);
}

export async function findUserByUsernameAndEmail(
	userName: string,
	email: string
): Promise<UserEntity | undefined> {
	const result = await db
		?.select()
		.from(users)
		.where(sql`${users.user_name} = ${userName} AND ${users.email} = ${email}`);

	if (result) {
		return result[0];
	}
}

export async function findUserByUsername(
	userName: string
): Promise<UserEntity | undefined> {
	const result = await db
		?.select()
		.from(users)
		.where(sql`${users.user_name} = ${userName}`);

	if (result) {
		return result[0];
	}
}
