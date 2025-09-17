import API from "./api";

export const searchQuery = async (query) => {
  try {
    const res = await API.get("/search", { params: { query } });
    return res.data;
  } catch (err) {
    console.error("Search API error:", err);
    return { products: [], stores: [], categories: [] };
  }
};
