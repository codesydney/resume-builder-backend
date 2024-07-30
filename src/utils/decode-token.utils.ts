import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export type TokenPayload = {
	user_id: string;
	iat: number;
	exp: number;
};

export function validateAndDecodeRefreshToken(
	refreshToken: string | undefined
): TokenPayload | undefined {
	if (!refreshToken) return;

	const decoded = jwt.verify(
		refreshToken,
		process?.env?.REFRESH_TOKEN_SECRET as string
	);

	if (!decoded) {
		return undefined;
	}

	const arrayToken = refreshToken.split('.');
	const tokenPayload: TokenPayload = JSON.parse(atob(arrayToken[1]));

	return tokenPayload;
}
