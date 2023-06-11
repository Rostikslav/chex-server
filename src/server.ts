import app from './api/app';
import Database from './api/db/Database';
import * as dotenv from 'dotenv'
import { QueryResponse } from './types';

dotenv.config();
const PORT = process.env.SERVER_PORT;

Database.connect((res: QueryResponse) => {
	console.log(res.body);
})

app.listen(PORT, () => {
	console.log('Listening on port ', PORT);
})