import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	user_id: uuid('user_id').primaryKey(),
	user_name: varchar('user_name', { length: 256 }).unique().notNull(),
	email: varchar('email', { length: 256 }).unique().notNull(),
	password: text('password').notNull(),
	role: text('role').$type<'USER' | 'SUPER_ADMIN'>().notNull().default('USER'),
	created_at: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		precision: 6,
		withTimezone: true,
	}),
});

/**
 * Data Types
 * Bellow are data types for different events i.e Request, Response etc
 */

export type UserEntity = typeof users.$inferSelect; // return type when queried
export type NewUserEntity = typeof users.$inferInsert; // insert type

export type UserRole = 'USER' | 'SUPER_ADMIN';

export type UserRequest = Omit<
	NewUserEntity,
	'user_id' | 'created_at' | 'updated_at' | 'role'
>;

export type UserResponse = Omit<
	NewUserEntity,
	'password' | 'created_at' | 'updated_at' | 'role'
>;
