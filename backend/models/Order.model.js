import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },

  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },

  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },

  paymentMethod: { type: String, enum: ['COD', 'Card', 'UPI', 'Wallet'], default: 'COD' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },

  orderStatus: { 
    type: String, 
    enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
    default: 'placed' 
  }

}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
