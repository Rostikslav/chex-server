import { Router, Request, Response } from 'express';
import {requireAuth, requireGuest} from '../../middleware';
import Database from '../../db/Database';
import { sessionController, userController } from '../../controllers'

const router = Router();

// API routes //
router.get('/', (req: Request, res: Response) => {
	res.send(Database.state)
})

router.post('/session', requireGuest, sessionController.createSession);
router.get('/session', requireAuth, sessionController.getSession);
router.delete('/session', requireAuth, sessionController.deleteSession);
router.post('/register', requireGuest, userController.register)
export default router;