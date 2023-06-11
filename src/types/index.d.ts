import { JwtPayload } from "jsonwebtoken"
import { ConnectionConfig } from "mysql";

export type QueryResponse = {
	err: boolean,
	body: any
}

export type Readable<T> = Pick<T, { [K in keyof T]: T[K] extends Readonly<T[K]> ? never : K }[keyof T]>;

export type rowId = number;
export type userId = rowId;
export type email = string;
export type username = string;
export type password = string;
export type score = number;
export type darkMode = boolean;
export type sessionId = rowId;
export type valid = boolean;

export type JWTResult = {
	payload: null | string | JwtPayload;
	expired: boolean;
}

// readonly properties fill automatically

export type User = {
	id: userId;
	email: email;
	username: username;
	password: password;
	score: score;
	dark_mode: darkMode;
}

export type Session = {
	id: sessionId;
	user_id: userId;
	valid: valid;
}

export type DBConfig = {
	connection: ConnectionConfig,
	retryConnectionDelay: number
}
