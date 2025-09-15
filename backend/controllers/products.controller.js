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

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, images, userId } = req.body;

    if (!name || !price || !category || !images?.length) {
      return res.status(400).json({ message: "Missing required fields or images" });
    }

    // Get user's store
    const store = await Store.findOne({ owner: userId, isVerified: true });
    if (!store) {
      return res.status(400).json({ message: "User has no verified store" });
    }

    // Use images directly from frontend (already uploaded to Cloudinary)
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
      store: store._id,
      images,
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category").populate("store");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};