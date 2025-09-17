import express from 'express';
import { searchQuery } from "../controllers/search.controller.js";
const router = express.Router();

router.get('/', searchQuery);

export default router;