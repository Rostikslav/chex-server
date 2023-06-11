import { Request, Response } from "express";
import { QueryResponse } from "../../../types";
import { Sessions } from "../../db/tables";
import { verifyJWT } from '../../services/jwt';

const deleteSessionController = async (req: Request, res: Response) => {
	const { refreshToken } = req.cookies;

	const { expired, payload } = verifyJWT(refreshToken);
	if (!expired && payload) {
		// @ts-ignore
		await Sessions.invalidate(payload.sessionId);
	}

	res.cookie("accessToken", "", {
		maxAge: 0,
		httpOnly: true,
	});

	res.cookie("refreshToken", "", {
		maxAge: 0,
		httpOnly: true,
	});

	return res.status(200).send({ err: false, body: 'Success' });
}

export default deleteSessionController;