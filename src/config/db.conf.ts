import * as dotenv from 'dotenv';

dotenv.config();
export default {
	connection: {
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
	},
	retryConnectionDelay: 10000
}