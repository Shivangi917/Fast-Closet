import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  orderStatus: { 
    type: String, 
    enum: ["placed", "shipped", "delivered", "cancelled"], 
    default: "placed" 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
