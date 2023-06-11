import express, { Request, Response } from 'express';
import api from './api';

const router = express.Router();

// Index routes //
router.use('/api', api);

export default router;