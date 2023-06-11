import { Request, Response } from "express";

const getSessionController = async (req: Request, res: Response) => {
	// @ts-ignore
	const { password: _, ...visibleUser } = req.user;
	res.status(200).send({ err: false, body: visibleUser });
}

export default getSessionController;