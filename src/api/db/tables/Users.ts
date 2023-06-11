import Table from './Table';
import { email, QueryResponse, User, userId, username } from "../../../types";
import Database from "../Database";

class Users extends Table<User> {

	getById(id: userId): Promise<QueryResponse> {
		return this.findBy({ id: id });
	}

	getByUsername(username: username): Promise<QueryResponse> {
		return this.findBy({ username: username });
	}

	getByEmail(email: email): Promise<QueryResponse> {
		return this.findBy({ email: email });
	}
}

export default new Users("users");