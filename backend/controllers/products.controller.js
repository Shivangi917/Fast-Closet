import Product from "../models/Product.model.js";
import Store from "../models/Store.model.js";
import Category from "../models/Category.model.js";

// Get all products (safe populate)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({ path: "category", select: "name", strictPopulate: false })
      .populate({ path: "store", select: "name location", strictPopulate: false });

    res.json(products);
  } catch (err) {
    console.error("Error in getProducts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get trending products by location
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
      .populate({ path: "category", select: "name", strictPopulate: false })
      .populate({ path: "store", select: "name location", strictPopulate: false })
      .limit(50);

    res.json(products);
  } catch (err) {
    console.error("Error in getTrendingProducts:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Add a product (also updates store's product list)
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand, images, userId } = req.body;

    if (!name || !price || !category || !images?.length) {
      return res.status(400).json({ message: "Missing required fields or images" });
    }

    const store = await Store.findOne({ owner: userId, isVerified: true });
    if (!store) return res.status(400).json({ message: "User has no verified store" });

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

    // Add product to store
    await Store.findByIdAndUpdate(store._id, { $push: { products: product._id } });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
