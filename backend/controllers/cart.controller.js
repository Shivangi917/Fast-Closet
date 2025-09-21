import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "UserId and ProductId are required" });
    }

    const product = await Product.findById(productId).populate("store");
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    let cart = await Cart.findOne({ customer: userId });
    if (!cart) {
      cart = new Cart({ customer: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        store: product.store._id,
        quantity,
      });
    }

    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ customer: userId })
      .populate("items.product")
      .populate("items.store");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ customer: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { customer: userId }, 
      { $set: { items: [], totalPrice: 0 } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
