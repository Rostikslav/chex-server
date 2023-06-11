import Table from './Table';
import { QueryResponse, Session, userId, sessionId } from '../../../types';

class Sessions extends Table<Session>{
	get(id: sessionId): Promise<QueryResponse> {
		return super.findBy({ id: id, valid: true });
	}

	create(userId: userId): Promise<QueryResponse> {
		return new Promise(async resolve => {
			const insertion: QueryResponse = await super.insert({ user_id: userId });
			if (insertion.err) {
				resolve(insertion);
				return;
			}
			const session = await super.findBy({ id: insertion.body.insertId });
			resolve(session);
		})
	}

	invalidate(id: sessionId): Promise<QueryResponse> {
		return super.update({ id: id }, { valid: false });
	}
}

export default new Sessions('sessions');