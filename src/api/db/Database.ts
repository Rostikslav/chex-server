import mysql, { Connection as MySQLConnection, QueryOptions, queryCallback, MysqlError } from 'mysql';
import { DBConfig, QueryResponse } from '../../types';
import config from '../../config/db.conf';


class Database {
	private _connection: MySQLConnection;
	private _config: DBConfig;

	constructor(config: DBConfig) {
		this._config = config
		this._connection = mysql.createConnection(this._config.connection);
	}

	get state() {
		return this._connection.state;
	}

	private onError = (err: any, callback: (res: QueryResponse) => void) => {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			callback({
				err: true,
				body: `DB connection has been lost.\nReconnecting in ${this._config.retryConnectionDelay / 1000}sec.`
			});
		}
		else if (err.code === 'ECONNREFUSED') {
			callback({
				err: true,
				body: `\nUnable to establish connection with database(${this._config.connection.database}).\nReconnecting in ${this._config.retryConnectionDelay / 1000}sec.`
			});

		}
		else {
			callback({
				err: true,
				body: 'Unknown error has been occured'
			});
		}
		setTimeout(() => {
			this._connection = mysql.createConnection(this._config.connection);
			this.connect(callback);
		}, this._config.retryConnectionDelay)
	}

	connect(callback: (res: QueryResponse) => void) {
		this._connection.on('error', err => this.onError(err, callback));

		this._connection.connect(err => {
			err
				? this._connection.emit('error', err)
				: callback({
					err: false,
					body: `\nDB: ${process.env.DB_NAME}\nUser: ${process.env.DB_USER}\nState: ${this.state}\n`
				});
		});
	}

	disconnect(): Promise<string> {
		return new Promise((resolve, reject) => {
			this._connection.end(err => {
				return err ? reject(err.message) : resolve(`Connection with ${process.env.DB_NAME} was closed`);
			})
		})
	}

	query(query: string | QueryOptions, values?: any, callback?: queryCallback): Promise<QueryResponse> {
		return new Promise((resolve) => {
			if (this.state === 'disconnected') resolve({ err: true, body: 'Database is disconnected' });
			if (this.state === 'protocol_error') resolve({ err: true, body: 'Database protocol error' });

			this._connection.query(query, values, (err: MysqlError | null, result: any) => {
				callback && callback(err, result);
				err && resolve({ err: true, body: { ...err } });
				resolve({ err: false, body: Array.isArray(result) && result.length === 0 ? null : result });
			});
		})
	}
}

export default new Database(config);