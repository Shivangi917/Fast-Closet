import express from 'express';
const router = express.Router();
import { getUserDetails, updateUserProfile } from '../controllers/user.controller.js';

// GET user details
router.get('/info/:userId', getUserDetails);

// PUT update user profile
router.put('/update/:id', updateUserProfile);

export default router;
