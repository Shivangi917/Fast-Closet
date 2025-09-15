import API from "./api";

export const getTrendingProducts = async (lat, lng) => {
  try {
    const res = await API.get(`/products/trending`, {
        params: {lat, lng},
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching trending products:", err);
    throw err;
  }
};