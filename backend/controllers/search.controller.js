import Product from "../models/Product.model.js";
import Store from "../models/Store.model.js";

export const searchQuery = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ products: [], stores: [], categories: [] });

    const phraseQuery = `"${query}"`; 

    const products = await Product.find(
      { $text: { $search: phraseQuery } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .select("name category images price");

    const stores = await Store.find(
      { $text: { $search: phraseQuery } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .select("name address isVerified");

    const categories = await Product.distinct("category", { $text: { $search: phraseQuery } });

    res.json({ products, stores, categories });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const autocompleteQuery = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const regex = new RegExp("^" + query, "i"); 

    const productNames = await Product.find({ name: regex }).limit(5).select("name");
    const storeNames = await Store.find({ name: regex }).limit(5).select("name");
    const categories = await Product.distinct("category", { category: regex });

    const suggestions = [
      ...productNames.map((p) => ({ type: "product", value: p.name })),
      ...storeNames.map((s) => ({ type: "store", value: s.name })),
      ...categories.map((c) => ({ type: "category", value: c })),
    ];

    res.json(suggestions);
  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
