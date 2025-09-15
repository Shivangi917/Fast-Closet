import express from 'express';
const router = express.Router();
import { getUserDetails } from '../controllers/user.controller.js';

router.get('/info/:userId', getUserDetails);

export default router;