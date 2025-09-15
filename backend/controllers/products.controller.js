import Product from '../models/Product.model.js';
import Store from "../models/Store.model.js";

export const getTrendingProducts = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ msg: "Missing coordinates" });
  }

  try {
    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000
        }
      }
    }).select('_id');

    const storeIds = nearbyStores.map(store => store._id);

    const products = await Product.find({ store: { $in: storeIds } })
                                  .populate('category')
                                  .populate('store')
                                  .limit(50); 

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};