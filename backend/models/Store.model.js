import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  isVerified: { type: Boolean, default: false }, 
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  contactNumber: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });

storeSchema.index({ location: "2dsphere" });

storeSchema.index(
  { name: "text", description: "text", "address.city": "text", "address.state": "text" },
  { weights: { name: 5, "address.city": 3, "address.state": 2, description: 1 } }
);

export default mongoose.model("Store", storeSchema);
