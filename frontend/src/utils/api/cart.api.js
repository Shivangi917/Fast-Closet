import API from "./api";

export const addProductToCart = async (userId, productId, quantity = 1) => {
  const res = await API.post(`/carts/add-to-cart`, { userId, productId, quantity });
  return res.data;
};

export const getCartByUser = async (userId) => {
  const res = await API.get(`/carts/${userId}`);
  return res.data;
};

export const removeProductFromCart = async (userId, productId) => {
  const res = await API.post(`/carts/remove-from-cart`, { userId, productId });
  return res.data;
};
