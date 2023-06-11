import { Request, Response, NextFunction } from "express";
import { QueryResponse, userId } from "../../types";
import { Sessions, Users } from "../db/tables";
import { verifyJWT, signJWT } from "../services/jwt";
import tokenConfig from "../../config/jwt.conf";


// TODO add browser info comparison before validating tokens 

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	const { accessToken, refreshToken } = req.cookies;
	console.log("\naccessToken:", accessToken);
	console.log("\nrefreshToken:", refreshToken);
	if (!accessToken) return next();

	const { payload: accessPayload, expired: accessExpired } = verifyJWT(accessToken);
	console.log('\nexpired: ', accessExpired);
	if (accessPayload) {
		// @ts-ignore
		const userObj = await Users.getById(accessPayload.userId);
		if (userObj.err) return res.status(500).send({ err: true, body: 'Internal server error' });
		if (!userObj.body) return res.status(404).send({ err: true, body: 'User was not found on the server. Try to log in again.' })

		// @ts-ignore
		req.user = userObj.body[0]
		return next();
	}

	const { payload: refreshPayload } = accessExpired && refreshToken
		? verifyJWT(refreshToken)
		: { payload: null }

	if (!refreshPayload) return next();

	// @ts-ignore
	const sessionObj: QueryResponse = await Sessions.get(refreshPayload.sessionId);
	if (sessionObj.err) return res.status(500).send({ err: true, body: 'Internal server error' });
	if (!sessionObj.body) return next();

	const newAccessToken = signJWT({ userId: sessionObj.body[0].user_id }, tokenConfig.access.expiresIn);

	res.cookie('accessToken', newAccessToken, {
		maxAge: tokenConfig.access.cookieMaxAge,
		httpOnly: true
	})

	const userObj: QueryResponse = await Users.getById(sessionObj.body[0].user_id);
	if (userObj.err) return res.status(500).send({ err: true, body: 'Internal server error' });
	if (!userObj.body) return res.status(404).send({ err: true, body: 'User was not found on the server. Try to log in again.' })
	// @ts-ignore
	req.user = userObj.body[0];

	return next();
}

export default deserializeUser;