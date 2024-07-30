import { findUserByUsernameAndEmail } from '../repositories/user.repository';
import { UserRequest } from '../schemas/user-schema.schema';
import { createUserService } from './user.service';
import {
	generateJwtAccessToken,
	generateJwtRefreshToken,
} from '../utils/generate-jwt-token.utils';
import {
	checkRefreshTokenInDB,
	revokeRefreshToken,
	storeRefreshToken,
} from '../repositories/refresh-token.repository';
import { NewRefreshTokenEntity } from '../schemas/refresh-token.schema';
import { generateUUIDv7 } from '../utils/uuidgenerator.utils';
import { comparedHashedValues } from '../utils/compare-hashed.utils';
import { asyncHashValues } from '../utils/hashPassword.utils';
import { validateAndDecodeRefreshToken } from '../utils/decode-token.utils';

export async function signupUserAuthService(requestData: UserRequest) {
	try {
		const result = await createUserService(requestData);
		return result;
	} catch (error) {
		throw error;
	}
}

export async function signInUserAuthService(requestData: UserRequest) {
	try {
		const { user_name, email, password } = requestData;
		const user = await findUserByUsernameAndEmail(user_name, email);
		if (!user) {
			throw new Error('Unauthorized');
		}

		// Comparing plain password vs hashed-password
		const isValid = await comparedHashedValues(password, user.password);

		if (!isValid) {
			throw new Error('Unauthorized');
		}

		const accessToken = generateJwtAccessToken(user.user_id);
		const refreshToken = generateJwtRefreshToken(user.user_id);
		const refreshTokenUUID = generateUUIDv7();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // Set expiry date to 7 days from now
		const hashedRefreshToken = await asyncHashValues(refreshToken);

		const newRefreshTokenEntity = <NewRefreshTokenEntity>{
			refresh_token_id: refreshTokenUUID,
			refresh_token: hashedRefreshToken,
			expires_at: expiresAt,
		};

		const result = await storeRefreshToken(newRefreshTokenEntity);

		if (result?.refresh_token_id) {
			return { accessToken: accessToken, refreshToken: refreshToken };
		}
	} catch (error) {
		// TODO: Add proper logger and typed error handler
		console.log('Service Error', error);
		throw new Error('Failed to login user. Please try again later.');
	}
}

export async function refreshTokenAuthService(
	userId: string,
	refreshToken: string
): Promise<{
	accessToken: string;
	refreshToken: string;
}> {
	try {
		const validToken = validateAndDecodeRefreshToken(refreshToken);

		if (!validToken) {
			throw new Error('Forbidden');
		}

		const storedValidRefreshHashedToken = await checkRefreshTokenInDB(
			userId,
			refreshToken
		);

		const verifiedRefreshToken = comparedHashedValues(
			refreshToken,
			storedValidRefreshHashedToken?.refresh_token as string
		);

		if (
			!storedValidRefreshHashedToken?.refresh_token ||
			!verifiedRefreshToken
		) {
			throw new Error('Forbidden');
		}

		const newAccessToken = generateJwtAccessToken(userId);

		return { accessToken: newAccessToken, refreshToken: refreshToken };
	} catch (error) {
		// TODO: Add proper logger and typed error handler
		console.log('Service Error', error);
		throw new Error('Failed to refresh token. Please try again later.');
	}
}

export async function signOutAuthService(
	userId: string,
	refreshToken: string
): Promise<string> {
	try {
		const validToken = validateAndDecodeRefreshToken(refreshToken);

		if (!validToken) {
			throw new Error('Forbidden');
		}

		const storedValidRefreshHashedToken = await checkRefreshTokenInDB(
			userId,
			refreshToken
		);

		const verifiedRefreshToken = comparedHashedValues(
			refreshToken,
			storedValidRefreshHashedToken?.refresh_token as string
		);

		if (
			!storedValidRefreshHashedToken?.refresh_token ||
			!verifiedRefreshToken
		) {
			throw new Error('Forbidden');
		}

		const result = await revokeRefreshToken(
			userId,
			storedValidRefreshHashedToken.refresh_token_id
		);

		if (!result?.refresh_token_id) {
			throw new Error('Forbidden');
		}

		return 'Signed out successfully';
	} catch (error) {
		// TODO: Add proper logger and typed error handler
		console.log('Service Error', error);
		throw new Error('Failed to refresh token. Please try again later.');
	}
}
