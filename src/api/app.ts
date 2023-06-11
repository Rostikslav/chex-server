import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv';

import routes from './routes';
import deserializeUser from './middleware/deserializeUser';

dotenv.config();
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
	origin: [`${[process.env.CLIENT_HOST]}`],
	methods: ['GET', 'POST'],
	credentials: true
}));
app.use(deserializeUser);

app.use('/', routes);

export default app;