import Payment from "../models/Payment.model.js";
import Order from "../models/Order.model.js";

import dotenv from "dotenv";
dotenv.config();

export const confirmPayment = async (req, res) => {
  const { paymentId } = req.body;

  const payment = await Payment.findByIdAndUpdate(paymentId);

  await Order.findByIdAndUpdate(payment.order, { paymentStatus: "paid" });

  if (!payment) return res.status(404).json({ message: "Payment not found" });

  payment.status = "success";
  await payment.save();

  res.json({ message: "Payment confirmed" });
};
