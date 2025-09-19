import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add-to-cart", addToCart);
router.get("/:userId", getCart);
router.post("/remove-from-cart", removeFromCart);

export default router;
