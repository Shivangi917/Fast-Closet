import express from "express";
import { searchQuery, autocompleteQuery } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", searchQuery);
router.get("/autocomplete", autocompleteQuery);

export default router;