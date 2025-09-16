import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  images: [String],
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
