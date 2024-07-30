import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import { users } from './user-schema.schema';

export const refresh_tokens = pgTable('refresh_token', {
	refresh_token_id: uuid('token_id').primaryKey(),
	user_id: uuid('user_id').references(() => users.user_id, {
		onDelete: 'cascade',
	}),
	refresh_token: text('refresh_token').notNull(),
	revoked: boolean('revoked'),
	created_at: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
	}).default(sql`now()`),
	expires_at: timestamp('expires_at', {
		precision: 6,
		withTimezone: true,
	}).notNull(),
});

export type RefreshTokenEntity = typeof refresh_tokens.$inferSelect;

export type NewRefreshTokenEntity = typeof refresh_tokens.$inferInsert;

export type RefreshTokenRequest = Omit<
	NewRefreshTokenEntity,
	'refresh_token_id' | 'user_id' | 'created_at' | 'expires_at' | 'revoked'
>;

export type RefreshTokenResponse = Omit<
	NewRefreshTokenEntity,
	'refresh_token_id' | 'user_id' | 'created_at' | 'expires_at' | 'revoked'
>;
