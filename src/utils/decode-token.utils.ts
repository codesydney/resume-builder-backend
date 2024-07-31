import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export type TokenPayload = {
	user_id: string;
	iat: number;
	exp: number;
};

//TODO: This should be a generic helper function, refactor later
export function decodeAccessToken(token: string | undefined) {
	if (!token) return;

	// TODO: decide if set up JWT_SECRET(s) as arg param
	const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

	if (decoded) {
		const arrayToken = token.split('.');
		const tokenPayload: TokenPayload = JSON.parse(atob(arrayToken[1]));

		return tokenPayload;
	}
}

//TODO: This should be a generic helper function, refactor later
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
