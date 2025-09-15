import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  storesName: { type: String, required: true },
  storesDescription: { type: String },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  ratings: [{
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String }
  }],

  isVerified: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model('Seller', sellerSchema);