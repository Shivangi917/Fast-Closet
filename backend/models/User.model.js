import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  role: {
    type: String,
    enum: ['customer', 'admin'],   // sellers are handled separately
    default: 'customer'
  },

  phone: { type: String },
  addresses: [addressSchema],

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]

}, { timestamps: true });

export default mongoose.model('User', userSchema);
