import { QueryResponse } from "../../types";
import bcrypt from 'bcrypt';

class Hasher {
	private rounds: number;

	public get saltRounds(): number {
		return this.rounds;
	}

	constructor(saltRounds: number) {
		this.rounds = saltRounds;
	}

	hash(payload: string | Buffer): Promise<QueryResponse> {
		return new Promise(resolve => {
			bcrypt.hash(payload, this.rounds)
				.then(hash => {
					resolve({ err: false, body: hash });
				})
				.catch(err => {
					resolve({ err: true, body: err })
				})
		})
	}

	compare(payload: string | Buffer, hash: string): Promise<QueryResponse> {
		return new Promise(resolve => {
			bcrypt.compare(payload, hash)
				.then(success => {
					resolve({ err: false, body: success });
				})
				.catch(err => {
					resolve({ err: true, body: err });
				})
		})
	}
}

export default new Hasher(11);