import Product from "../models/Product.model.js";
import Store from "../models/Store.model.js";

export const searchQuery = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ products: [], stores: [], categories: [] });
    }

    // Search Products using text index
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .select("name category images price score");

    // Search Stores using text index
    const stores = await Store.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .select("name address isVerified score");

    // Get distinct categories (based on matched products)
    const categories = await Product.distinct("category", { $text: { $search: query } });

    res.json({ products, stores, categories });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};