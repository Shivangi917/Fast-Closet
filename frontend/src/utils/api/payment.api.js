import API from './api';

export const createPaymentIntent = async (orderId) => {
  const { data } = await API.post("/payment/create-payment-intent", { orderId });
  return data;
};

export const confirmPayment = async (paymentId) => {
  const { data } = await API.post("/payment/confirm-payment", { paymentId });
  return data;
};
