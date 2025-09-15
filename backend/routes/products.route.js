import express from 'express';
const router = express.Router();
import { getTrendingProducts } from '../controllers/products.controller.js';

router.get('/trending', getTrendingProducts);

export default router;