import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Card', 'UPI', 'Wallet', 'COD'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionId: { type: String }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
