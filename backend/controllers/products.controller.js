import Product from '../models/Product.model.js';

export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(12);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};