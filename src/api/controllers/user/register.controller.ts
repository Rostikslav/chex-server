import { Request, Response } from "express";
import { Users } from "../../db/tables";
import { Hasher } from "../../utils";

const register = async (req: Request, res: Response) => {
	if (!req.body ||
		!req.body.email ||
		!req.body.username ||
		!req.body.password) return res.status(400).send({ err: true, body: "Request must contain all required fields" })

	const { email, username, password } = req.body;

	const emailExists = await Users.getByEmail(email);
	if (emailExists.err) return res.status(500).send({ err: true, body: "Internal DB error" })
	if(emailExists.body) return res.status(409).send({ err: true, body: "Email already registered" })

	const usernameExists = await Users.getByUsername(username);
	if (usernameExists.err) return res.status(500).send({ err: true, body: "Internal DB error" })
	if(usernameExists.body) return res.status(409).send({ err: true, body: "Username already taken" })

	const passwordObj = await Hasher.hash(password);
	console.log(passwordObj);
	if (passwordObj.err) return res.status(500).send({ err: true, body: "Internal server error" })

	const insert = await Users.insert({
		email: email,
		username: username,
		password: passwordObj.body
	})
	console.log('inserted');
	if (insert.err) return res.status(500).send({ err: true, body: "Internal DB error" });
	res.status(200).send({err: false, body: "Successfully registered"});
}

export default register;