import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCartByUser,
  removeProductFromCart,
  addProductToCart,
} from "../../utils/api/cart.api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (user) {
      getCartByUser(user.id).then(setCart).catch(console.error);
    }
  }, [user]);

  // Increase qty
  const increaseQty = async (productId) => {
    const updatedCart = await addProductToCart(user.id, productId, 1);
    setCart(updatedCart);
    window.location.reload();
  };

  // Decrease qty
  const decreaseQty = async (productId) => {
    const item = cart.items.find((i) => i.product._id === productId);
    if (item.quantity > 1) {
      // reduce by 1
      const updatedCart = await addProductToCart(user.id, productId, -1); 
      setCart(updatedCart);
      window.location.reload();
    } else {
      // remove if qty = 1
      const updatedCart = await removeProductFromCart(user.id, productId);
      setCart(updatedCart);
      window.location.reload();
    }
  };

  if (!cart) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cart.items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              {/* Product Image */}
              <Link to={`/product/${item.product._id}`} className="w-28 h-28 flex-shrink-0">
                <img
                  src={item.product.images?.[0] || "/placeholder.png"}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 ml-4">
                <Link
                  to={`/product/${item.product._id}`}
                  className="text-lg font-semibold text-gray-800 hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-gray-600">{item.product.brand}</p>
                <p className="text-teal-600 font-bold mt-1">
                  ₹{item.product.price}
                </p>
              </div>

              {/* Quantity Controls */}
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

          {/* Total */}
          <div className="text-right text-xl font-semibold mt-6">
            Total: ₹{cart.totalPrice}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
