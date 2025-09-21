import express from "express";
import { createOrder, getOrdersByUser, getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/user/:userId", getOrdersByUser);
router.get("/get/:id", getOrderById);

export default router;
