import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  fetchProductById,
  fetchSimilarProducts,
} from "../../utils/api/product.api.js";
import { addProductToCart } from "../../utils/api/cart.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { confirmPayment } from "../../utils/api/payment.api.js";
import { createOrder } from '../../utils/api/order.api.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ProductDetail = () => {
  const { user } = useAuth();
  const { productId } = useParams();
  const location = useLocation();
  const { product: passedProduct } = location.state || {};

  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [error, setError] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    const loadSimilar = async () => {
      try {
        const data = await fetchSimilarProducts(productId);
        setSimilarProducts(data);
      } catch (err) {
        console.error("Error fetching similar products:", err);
      }
    };
    loadSimilar();
  }, [productId]);

  const addToCart = async (product) => {
    try {
      const cart = await addProductToCart(user.id, product._id, 1);
      console.log("Cart updated: ", cart);
      alert("Product added to cart!");
    } catch (error) {
      console.log("Error adding to cart: ", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      const items = [{
        store: product.store._id,
        product: product._id,
        quantity: 1,
        price: product.price
      }];

      const shippingAddress = user.address;

      const { clientSecrets } = await createOrder({
        userId: user.id,
        items,
        shippingAddress
      });

      if (!clientSecrets || clientSecrets.length === 0) {
        throw new Error("No client secret returned from server");
      }

      const stripe = await stripePromise;

      // Since Buy Now = single store, we just take the first one
      const { clientSecret, paymentId } = clientSecrets[0];

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: { token: "tok_visa" }
        },
      });

      if (error) {
        alert("Payment failed: " + error.message);
      } else {
        await confirmPayment(paymentId);
        alert("Payment successful!");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  if (loading) return <div className="p-6">Loading product details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!product) return <div className="p-6 text-red-600">Product not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-4">
            {product.images?.slice(1).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-700 mt-2">{product.brand}</p>
          <p className="text-2xl font-semibold text-teal-600 mt-4">
            ₹{product.price}
          </p>

          <p
            className={`mt-2 ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <p className="mt-4 text-gray-700">{product.description}</p>

          {/* Store Info */}
          {product.store && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold text-gray-800">Store Info</h3>
              <p className="text-gray-700">{product.store.name}</p>
              {product.store.address && (
                <p className="text-gray-600 text-sm">
                  📍 {product.store.address.street},{" "}
                  {product.store.address.city}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
              disabled={product.stock === 0}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              disabled={product.stock === 0}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Explore Similar Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                state={{ product: p }}
                className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-gray-900 font-medium truncate">
                    {p.name}
                  </h3>
                  <p className="text-teal-600 font-semibold">₹{p.price}</p>
                  {p.store && (
                    <p className="text-sm text-gray-500">{p.store.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
