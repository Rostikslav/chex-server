import { Request, Response } from "express";
import { Sessions } from "../../db/tables";
import { QueryResponse, Session, User } from '../../../types';
import { validateUser } from '../../services/user.services';
import { signJWT } from "../../services/jwt";
import tokenConfig from '../../../config/jwt.conf'

const createSessionController = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const userObj: QueryResponse = await validateUser(username, password);

	if (userObj.err) return res.status(500).send({ err: true, body: "Internal DB error" });
	if (!userObj.body) return res.status(401).send({ err: true, body: 'Invalid username or password' });

	const user: User = userObj.body;

	const sessionObj = await Sessions.create(user.id);
	if (sessionObj.err) return res.status(500).send({ err: true, body: 'Internal server error' });

	const session: Session = sessionObj.body[0];

	const accessToken = signJWT({ userId: user.id }, tokenConfig.access.expiresIn);
	const refreshToken = signJWT({ sessionId: session.id }, tokenConfig.refresh.expiresIn);

	res.cookie("accessToken", accessToken, {
		maxAge: tokenConfig.access.cookieMaxAge,
		httpOnly: true
	});

	res.cookie("refreshToken", refreshToken, {
		maxAge: tokenConfig.refresh.cookieMaxAge,
		httpOnly: true
	});

	return res.status(200).send({
		err: false,
		body: "Success"
	})
}

export default createSessionController;