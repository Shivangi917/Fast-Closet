import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] 
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

storeSchema.index({ location: '2dsphere' });
export default mongoose.model('Store', storeSchema);