import {
	NewRefreshTokenEntity,
	refresh_tokens,
	RefreshTokenEntity,
} from '../schemas/refresh-token.schema';
import { db } from '../db/db';
import { sql } from 'drizzle-orm';

export async function storeRefreshToken(
	newRefreshTokenEntity: NewRefreshTokenEntity
): Promise<RefreshTokenEntity | undefined> {
	const result = await db
		?.insert(refresh_tokens)
		.values(newRefreshTokenEntity)
		.returning();

	if (result) {
		return result[0];
	}
}

export async function checkRefreshTokenInDB(
	userId: string,
	refreshToken: string
): Promise<RefreshTokenEntity | undefined> {
	const result = await db
		?.select()
		.from(refresh_tokens)
		.where(
			sql`
            ${refresh_tokens.user_id} = ${userId}
            AND ${refresh_tokens.refresh_token} = ${refreshToken} 
            AND ${refresh_tokens.expires_at} > NOW() 
            AND ${refresh_tokens.revoked} IS NOT TRUE
            `
		);

	if (result) {
		return result[0];
	}
}

export async function revokeRefreshToken(
	userId: string,
	refreshTokenId: string
): Promise<
	| {
			refresh_token_id: string;
	  }
	| undefined
> {
	const expiredAt = new Date();
	expiredAt.setDate(expiredAt.getDate() - 7); // Set expiry date to -7 days just in case
	const result = await db
		?.update(refresh_tokens)
		.set({
			revoked: true,
			expires_at: expiredAt,
		})
		.where(
			sql`
            ${refresh_tokens.user_id} = ${userId}
            AND ${refresh_tokens.refresh_token_id} = ${refreshTokenId} 
            `
		)
		.returning({ refresh_token_id: refresh_tokens.refresh_token_id });

	if (result) {
		return result[0];
	}
}
