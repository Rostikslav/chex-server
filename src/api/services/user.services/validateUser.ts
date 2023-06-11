import { Users } from "../../db/tables";
import { password, User, username } from "../../../types";
import { QueryResponse } from '../../../types/index';
import { Hasher } from '../../utils';

/**
 * @returns *QueryResponse* with user object inside if success, otherwise - *null*;
 */
const validateUser = (username: username, password: password): Promise<QueryResponse> => {
	return new Promise(async resolve => {
		const userObj: QueryResponse = await Users.getByUsername(username);
		if (userObj.err || !userObj.body) {
			resolve(userObj);
			return;
		}
		
		const user: User = userObj.body[0];
		const compareRes: QueryResponse = await Hasher.compare(password, user.password);
		if (compareRes.err) {
			resolve(compareRes)
			return;
		}

		resolve({ err: false, body: compareRes.body ? user : null })
	})
}

export default validateUser;