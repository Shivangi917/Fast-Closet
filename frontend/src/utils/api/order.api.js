import API from './api';

export const createOrder = async ({ userId, items, shippingAddress }) => {
  const { data } = await API.post("/order/create", { userId, items, shippingAddress });
  return data;
};

export const getOrdersByUser = async (userId) => {
  const res = await API.get(`/order/user/${userId}`);
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await API.get(`/order/get/${orderId}`);
  return res.data;
};
