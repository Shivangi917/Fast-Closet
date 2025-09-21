import Order from "../models/Order.model.js";
import Payment from "../models/Payment.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to order" });
    }

    const itemsByStore = items.reduce((acc, item) => {
      if (!acc[item.store]) acc[item.store] = [];
      acc[item.store].push(item);
      return acc;
    }, {});

    let allOrders = [];
    let allPayments = [];
    let clientSecrets = [];

    for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
      const totalAmount = storeItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      const order = await Order.create({
        customer: userId,
        store: storeId,
        items: storeItems,
        totalAmount,
        shippingAddress,
        paymentMethod: "Card",
        paymentStatus: "pending",
        orderStatus: "placed",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: "inr",
        metadata: { orderId: order._id.toString() },
      });

      const payment = await Payment.create({
        order: order._id,
        amount: totalAmount,
        method: "Card",
        status: "pending",
        paymentIntentId: paymentIntent.id,
      });

      allOrders.push(order);
      allPayments.push(payment);
      clientSecrets.push({
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id,
      });
    }

    res.json({ orders: allOrders, payments: allPayments, clientSecrets });
  } catch (err) {
    console.error("Error creating orders:", err);
    res.status(500).json({ message: "Failed to create orders" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ customer: userId })
      .populate("customer", "name email phone") 
      .populate("store", "name address contactNumber")
      .populate("items.product");

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const order = await Order.findById(id)
      .populate("customer", "name email phone")
      .populate("store", "name address contactNumber")
      .populate("items.product"); 

    if (!order) return res.status(404).json({ message: "Order not found" });

    console.log(order);

    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};