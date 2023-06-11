import * as dotenv from 'dotenv';

dotenv.config();
export default {
	access: {
		expiresIn: 15, // s
		cookieMaxAge: 6.048e+8 // access and refresh token cookies expire at the same time 
	},
	refresh: {
		expiresIn: 604800, // 1w 604800
		cookieMaxAge: 6.048e+8 // 1w 6.048e+8
	}
}