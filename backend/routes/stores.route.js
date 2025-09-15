import express from 'express';
const router = express.Router();
import { addStore, getNearbyStores, getStoresByUser } from'../controllers/stores.controller.js';
import { protect } from '../middleware/auth.middleware.js';

router.get('/nearby', getNearbyStores);
router.post('/add-store', protect, addStore);
router.get("/user/:userId", getStoresByUser);

export default router;