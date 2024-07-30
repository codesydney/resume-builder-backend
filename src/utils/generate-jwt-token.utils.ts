import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateJwtAccessToken(userId: string): string {
	return jwt.sign(
		{ userId: userId },
		String(process.env.JWT_SECRET).replace(/\\n/g, '\n'),
		{
			expiresIn: '5m',
			algorithm: 'HS256',
		}
	);
}

export function generateJwtRefreshToken(userId: string): string {
	return jwt.sign(
		{ userId: userId },
		String(process.env.REFRESH_TOKEN_SECRET).replace(/\\n/g, '\n'),
		{
			expiresIn: '7d',
			algorithm: 'HS256',
		}
	);
}
