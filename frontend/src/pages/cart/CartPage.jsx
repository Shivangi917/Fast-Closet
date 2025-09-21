import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCartByUser,
  removeProductFromCart,
  addProductToCart,
  clearCart
} from "../../utils/api/cart.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { confirmPayment } from "../../utils/api/payment.api.js";
import { createOrder } from "../../utils/api/order.api.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    if (user) {
      getCartByUser(user.id).then(setCart).catch(console.error);
    }
  }, [user]);

  // helper: extract store id (works if store is string id or object)
  const getStoreIdFromItem = (item) => {
    if (!item) return null;
    if (item.store) {
      return typeof item.store === "string" ? item.store : item.store._id || item.store.id || null;
    }
    const ps = item.product?.store;
    if (!ps) return null;
    return typeof ps === "string" ? ps : ps._id || ps.id || null;
  };

  // helper: extract store object if available (populated)
  const getStoreObjFromItem = (item) => {
    if (!item) return null;
    if (item.store && typeof item.store === "object") return item.store;
    if (item.product?.store && typeof item.product.store === "object") return item.product.store;
    return null;
  };

  // Increase qty
  const increaseQty = async (productId) => {
    try {
      const updatedCart = await addProductToCart(user.id, productId, 1);
      setCart(updatedCart);
    } catch (err) {
      console.error("increaseQty error:", err);
    }
  };

  // Decrease qty
  const decreaseQty = async (productId) => {
    try {
      const item = cart.items.find((i) => i.product._id === productId);
      if (!item) return;
      if (item.quantity > 1) {
        const updatedCart = await addProductToCart(user.id, productId, -1);
        setCart(updatedCart);
      } else {
        const updatedCart = await removeProductFromCart(user.id, productId);
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("decreaseQty error:", err);
    }
  };

  // Group items by store (normalized)
  const groupByStore = (items = []) => {
    return items.reduce((acc, item) => {
      const storeId = getStoreIdFromItem(item) || "unknown_store";
      const storeObj = getStoreObjFromItem(item) || { _id: storeId, name: typeof storeId === "string" ? `Store ${storeId.slice(-6)}` : "Store" };

      if (!acc[storeId]) acc[storeId] = { store: storeObj, items: [] };
      acc[storeId].items.push(item);
      return acc;
    }, {});
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setLoadingCheckout(true);

      // Normalize and prepare items for API
      const itemsForOrder = cart.items.map((i) => {
        const storeId = getStoreIdFromItem(i);
        if (!storeId) throw new Error(`Missing store for product ${i.product?.name || i.product?._id}`);
        return {
          store: storeId,
          product: i.product._id,
          quantity: i.quantity,
          price: i.product.price,
        };
      });

      const shippingAddress = user.address;

      const resp = await createOrder({
        userId: user.id,
        items: itemsForOrder,
        shippingAddress,
      });

      // createOrder might return { clientSecrets } or { clientSecrets: [...] } or similar — normalize:
      const clientSecrets = resp?.clientSecrets || (Array.isArray(resp) ? resp : null);
      if (!clientSecrets || clientSecrets.length === 0) {
        throw new Error("No payment intents returned from server");
      }

      const stripe = await stripePromise;

      for (const cs of clientSecrets) {
        const clientSecret = cs?.clientSecret || cs?.client_secret || null;
        const paymentId = cs?.paymentId || cs?.payment_id || cs?._id || null;

        if (!clientSecret || !paymentId) {
          throw new Error("Invalid payment info from server");
        }

        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: { token: "tok_visa" } }, // TODO: replace with real Elements
        });

        if (error) {
          alert("Payment failed: " + error.message);
          setLoadingCheckout(false);
          return;
        } else {
          await confirmPayment(paymentId);
        }
      }

      // clear cart both backend + frontend
      try {
        await clearCart(user.id);
      } catch (err) {
        console.warn("Failed to clear backend cart, but frontend will be cleared:", err);
      }
      setCart({ items: [], totalPrice: 0 });

      alert("All payments successful!");
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed: " + (err.message || "Unknown error"));
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  const groupedStores = groupByStore(cart.items);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cart.items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedStores).map(([storeId, { store, items }]) => {
            const displayStoreName = store?.name || `Store ${String(storeId).slice(-6)}`;
            const keyId = store?._id || storeId;
            return (
              <div key={keyId} className="border rounded-lg p-4 shadow-md bg-gray-50">
                <h3 className="text-xl font-semibold mb-4">{displayStoreName}</h3>

                {items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center bg-white rounded-lg shadow-sm p-4 mb-3"
                  >
                    <Link to={`/product/${item.product._id}`} className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.png"}
                        alt={item.product?.name || "product"}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </Link>

                    <div className="flex-1 ml-4">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-lg font-semibold text-gray-800 hover:underline"
                      >
                        {item.product?.name || "Product"}
                      </Link>
                      <p className="text-gray-600">{item.product?.brand || ""}</p>
                      <p className="text-teal-600 font-bold mt-1">
                        ₹{item.product?.price ?? "—"}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decreaseQty(item.product._id)}
                        className="px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2 text-lg">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.product._id)}
                        className="px-3 py-1 border rounded-lg bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="text-right text-xl font-semibold mt-6">
            Total: ₹{cart.totalPrice ?? 0}
          </div>
          <button
            disabled={loadingCheckout}
            className="bg-teal-600 px-4 py-2 rounded hover:scale-105 text-white cursor-pointer hover:bg-teal-700 disabled:opacity-60"
            onClick={handleCheckout}
          >
            {loadingCheckout ? "Processing..." : "Buy All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
