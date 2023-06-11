import Database from "../Database";
import { QueryResponse } from "../../../types";

abstract class Table<T>{
	protected _name: string;

	constructor(name: string) {
		this._name = name;
	}

	/**
	 * Returns a name of the table
	 */
	public get name(): string {
		return this._name;
	}

	insert<K extends keyof T>(pairs: Record<K, T[K]>): Promise<QueryResponse> {
		const keys = Object.keys(pairs);
		const values = Object.values(pairs);

		return Database.query(
			`INSERT INTO ${this._name} (${keys.join(', ')}) VALUES ('${values.join("', '")}')`
		)
	}

	/**
	 * Returns all rows of the table that have all given keys with all corresponding values.
	 * Selectors will be joint by **AND**.
	 * @returns Promise of type *QueryResponse*
	*/
	findBy<K extends keyof T>(selectors?: Record<K, T[K] | T[K][]>): Promise<QueryResponse> {
		const empty: boolean = !selectors || Object.keys(selectors).length === 0;
		let queryWhere: string[] = [];
		if (selectors) {
			for (const [key, value] of Object.entries(selectors)) {
				if (Array.isArray(value)) {
					queryWhere.push(`${key} in ('${value.join("','")}')`);
				}
				else if (typeof value === "boolean") {
					queryWhere.push(`${key} = ${value}`);
				}
				else {
					queryWhere.push(`${key} = '${value}'`);
				}
			}
		}

		const query = empty
			? `SELECT * FROM ${this._name}`
			: `SELECT * FROM ${this._name} WHERE ${queryWhere.join(' AND ')}`;

		return Database.query(query);
	}

	/**
	 * Returns all rows of the table that have any of given keys with any of corresponding values.
	 * Selectors will be joint by **OR**.
	 * @returns Promise of type **QueryResponse**
	*/
	findByAny<K extends keyof T>(selectors: Record<K, T[K] | T[K][]>): Promise<QueryResponse> {
		let queryWhere: string[] = [];
		for (const [key, value] of Object.entries(selectors)) {
			if (Array.isArray(value)) {
				queryWhere.push(`${key} in ('${value.join("','")}')`);
			}
			else if(typeof value === "boolean"){
				queryWhere.push(`${key} = ${value}`);
			}
			else{
				queryWhere.push(`${key} = '${value}'`);

			}
		}

		return Database.query(
			`SELECT * FROM ${this._name} WHERE ${queryWhere.join(' OR ')}`
		);
	}

	/**
	 * Deletes all records that have all given keys with all corresponding values.
	 * Selectors will be joint by **AND**.
	 * If selectors are empty all records will be deleted.
	 * @returns Promise of type *QueryResponse*
	*/
	delete<K extends keyof T>(selectors?: Record<K, T[K] | T[K][]>): Promise<QueryResponse> {
		const empty: boolean = !selectors || Object.keys(selectors).length === 0;
		let queryWhere: string[] = [];
		if (selectors) {
			for (const [key, value] of Object.entries(selectors)) {
				if (Array.isArray(value)) {
					queryWhere.push(`${key} in ('${value.join("','")}')`);
				}
				else if (typeof value === "boolean") {
					queryWhere.push(`${key} = ${value}`);
				}
				else {
					queryWhere.push(`${key} = '${value}'`);
				}
			}
		}

		const query = empty
			? `DELETE FROM ${this._name}`
			: `DELETE FROM ${this._name} WHERE ${queryWhere.join(' AND ')}`;

		return Database.query(query);
	}

	/**
	 * Deletes all records that have any of given keys with any of corresponding values.
	 * Selectors will be joint by **OR**.
	 * @returns Promise of type *QueryResponse*
	*/
	deleteAny<K extends keyof T>(selectors: Record<K, T[K] | T[K][]>): Promise<QueryResponse> {
		let queryWhere: string[] = [];
		for (const [key, value] of Object.entries(selectors)) {
			if (Array.isArray(value)) {
				queryWhere.push(`${key} in ('${value.join("','")}')`);
			}
			else if (typeof value === "boolean") {
				queryWhere.push(`${key} = ${value}`);
			}
			else {
				queryWhere.push(`${key} = '${value}'`);
			}
		}

		return Database.query(
			`DELETE FROM ${this._name} WHERE ${queryWhere.join(' OR ')}`
		);
	}

	/**
	 * Applies given values to all records that match given selectors.
	 * @returns Promise of type *QueryResponse*  
	 */
	update<O extends keyof T, K extends keyof T>(selectors: Record<O, T[O] | T[O][]>, newValues: Record<K, T[K]>): Promise<QueryResponse> {
		const newValuesArr: string[] = [];
		const selectorsArr: string[] = [];

		for (const [key, value] of Object.entries(newValues)) {
			newValuesArr.push(`${key} = ${value}`);
			if (typeof value === "boolean") {
				newValuesArr.push(`${key} = ${value}`);
			}
			else {
				newValuesArr.push(`${key} = '${value}'`);
			}
		}
		for (const [key, value] of Object.entries(selectors)) {
			if (Array.isArray(value)) {
				selectorsArr.push(`${key} in ("${value.join("','")}')`);
			}
			else if (typeof value === "boolean") {
				selectorsArr.push(`${key} = ${value}`);
			}
			else {
				selectorsArr.push(`${key} = '${value}'`);
			}
		}

		return Database.query(
			`UPDATE ${this._name} SET ${newValuesArr.join(', ')} WHERE ${selectorsArr.join(' AND ')}`
		)
	}
}

export default Table;