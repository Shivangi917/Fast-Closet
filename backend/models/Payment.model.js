import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  amount: Number,
  method: { type: String, enum: ["card", "upi", "cod"], default: "cod" },
  status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
  transactionId: String,
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
