import { sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { UUID } from 'uuidv7';

export const users = pgTable('users', {
	id: serial('user_id').$type<UUID>().primaryKey(),
	user_name: varchar('user_name', { length: 256 }).unique().notNull(),
	email: varchar('email', { length: 256 }).unique().notNull(),
	password: varchar('password', { length: 512 }).notNull(),
	role: varchar('role', { length: 32 }).notNull(),
	created_at: timestamp('created_at', {
		precision: 6,
		withTimezone: true,
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		precision: 6,
		withTimezone: true,
	}),
});

export type UserEntity = typeof users.$inferSelect; // return type when queried
export type NewUserEntity = typeof users.$inferInsert; // insert type
