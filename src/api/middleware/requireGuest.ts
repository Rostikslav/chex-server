import { NextFunction, Request, Response } from "express";

const requireGuest = (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	if (req.user) {
		return res.status(401).send({ err: true, body: "Non-auth-only path" });
	}
	next();
}

export default requireGuest;