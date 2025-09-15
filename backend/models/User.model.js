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

  // Role management
  roles: { 
    type: [String], 
    enum: ["user", "vendor", "admin"], 
    default: "user" 
  },

  // Vendor verification
  isVerifiedVendor: { type: Boolean, default: false },
  vendorProof: { type: String }, // URL or filename of uploaded document (optional)

  // Cart and address
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  address: addressSchema, // embedded address

  // Optional fields for vendors
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
