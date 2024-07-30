import bcrypt from 'bcrypt';

export async function comparedHashedValues(
	plainString: string,
	hashedString: string
): Promise<boolean> {
	return await bcrypt.compare(plainString, hashedString);
}
