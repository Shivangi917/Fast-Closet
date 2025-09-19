import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
  quantity: { type: Number, default: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);