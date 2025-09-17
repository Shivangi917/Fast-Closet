import Product from "../models/Product.model.js";
import Store from "../models/Store.model.js";

export const searchQuery = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ products: [], stores: [], categories: [] });
    }

    const regex = new RegExp(`^${query}`, "i"); // case-insensitive

    // Search Products
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex }
      ]
    }).limit(5).select("name category images price");

    // Search Stores
    const stores = await Store.find({
      $or: [
        { name: regex },
        { description: regex },
        { "address.city": regex },
        { "address.state": regex }
      ]
    }).limit(5).select("name address isVerified");

    // Get distinct categories
    const categories = await Product.distinct("category", { category: regex });

    res.json({ products, stores, categories });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
