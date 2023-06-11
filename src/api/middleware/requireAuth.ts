import { NextFunction, Request, Response } from "express";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	// @ts-ignore
	if (!req.user) {
		return res.status(401).send({ err: true, body: "Authorization required" });
	}
	next();
}

export default requireAuth;