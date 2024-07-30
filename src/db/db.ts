import dotenv from 'dotenv';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

function drizzleInit(): NodePgDatabase<Record<string, never>> | undefined {
	try {
		dotenv.config();
		const connectionString = process?.env?.DB_URL;

		if (!connectionString) {
			throw new Error('Drizzle Invalid Connection String');
		}

		const pool = new Pool({
			connectionString: connectionString,
		});

		return drizzle(pool);
	} catch (error) {
		// TODO: Add proper logger and typed error handler
		console.log('Drizzle Connection Error: ', error);
	}
}

export const db = drizzleInit();
