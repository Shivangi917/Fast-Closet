import express from 'express';
const router = express.Router();
import { getNearbyStores } from'../controllers/stores.controller.js';

router.get('/nearby', getNearbyStores);

export default router;