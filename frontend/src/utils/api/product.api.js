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

export const addProduct = async (formData) => {
  try {
    const res = await API.post("/products/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error adding product:", err);
    throw err;
  }
};

export const getProducts = async () => {
  try {
    const res = await API.get("/products/get");
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};
