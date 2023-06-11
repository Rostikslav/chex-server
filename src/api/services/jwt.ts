import jwt, { Secret } from 'jsonwebtoken';
import { JWTResult } from '../../types/index';
import * as dotenv from 'dotenv';

dotenv.config();

export const signJWT = (payload: string | object | Buffer, expiresIn: number | string): string => {
	return jwt.sign(
		payload,
		process.env.RSA_PRIVATE_KEY || "",
		{
			algorithm: "RS256",
			expiresIn: expiresIn
		}
	);
}

export const verifyJWT = (token: string): JWTResult => {
	try {
		const decoded = jwt.verify(token, process.env.RSA_PUBLIC_KEY as Secret);
		return { payload: decoded, expired: false };
	} catch (error) {
		return { payload: null, expired: (error as Error).message.includes("jwt expired") };
	}
}