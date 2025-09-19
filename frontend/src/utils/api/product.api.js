import API from "./api";

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

export const fetchProducts = async (lat, lng) => {
  try {
    const res = await API.get(`/products/all-products?lat=${lat}&lng=${lng}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

export const fetchProductsOfStore = async () => {
  try {
    const res = await API.get(`/products/store/${storeId}/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product:", err);
  }
};

export const getNearbyProductsByCategory = async (lat, lng, category) => {
  const res = await API.get(`/products/category?lat=${lat}&lng=${lng}&category=${category}`);
  return res.data;
};

export const fetchProductById = async (productId) => {
  const res = await API.get(`/products/product-id/${productId}`);
  return res.data;
};

export const fetchProductsByStore = async (storeId) => {
  const res = await API.get(`/products/store/${storeId}`);
  return res.data;
};

export const fetchSimilarProducts = async (productId) => {
  const res = await API.get(`/products/${productId}/similar`);
  return res.data;
};
