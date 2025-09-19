import Product from "../models/Product.model.js";
import Store from "../models/Store.model.js";
import Review from "../models/Review.model.js";

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

    await Store.findByIdAndUpdate(store._id, { $push: { products: product._id } });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getNearbyProductsByCategory = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000, category } = req.query;

    if (!lng || !lat || !category) {
      return res.status(400).json({ message: "lng, lat, and category are required" });
    }

    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select("_id");

    if (!nearbyStores.length) {
      return res.json({ products: [] });
    }

    const storeIds = nearbyStores.map(store => store._id);
    const products = await Product.find({
      store: { $in: storeIds },
      category
    }).populate("store", "name address");

    res.json({ products });
  } catch (err) {
    console.error("Error fetching nearby products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("store", "name address location")
      .populate("review");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error in getProductById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProductsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const products = await Product.find({ store: storeId })
      .populate("store", "name address");

    res.json(products);
  } catch (err) {
    console.error("Error in getProductsByStore:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: "lng and lat are required" });
    }

    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).select("_id");

    if (!nearbyStores.length) {
      return res.json([]);
    }

    const storeIds = nearbyStores.map((store) => store._id);
    const products = await Product.find({ store: { $in: storeIds } })
      .populate("store", "name address");

    res.json(products);
  } catch (err) {
    console.error("Error fetching nearby products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id } 
    })
      .limit(6)
      .populate("store", "name address");

    res.json(similarProducts);
  } catch (err) {
    console.error("Error fetching similar products:", err);
    res.status(500).json({ message: "Server error" });
  }
};
