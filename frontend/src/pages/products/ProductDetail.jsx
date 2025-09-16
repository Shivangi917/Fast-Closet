import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { product: passedProduct } = location.state || {};
  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);

  // Fallback fetch in case user refreshes or comes directly
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${productId}`);
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          console.error("Error fetching product:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, product]);

  if (loading) return <div className="p-6">Loading product...</div>;
  if (!product) return <div className="p-6 text-red-600">Product not found</div>;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">
      {/* Image */}
      <div>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Details */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-gray-900 font-semibold text-2xl mb-4">
          ₹{product.price}
        </p>
        <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
        <p className="text-gray-600 mb-2">
          Stock:{" "}
          <span
            className={product.stock > 0 ? "text-green-600" : "text-red-600"}
          >
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </span>
        </p>
        <p className="text-gray-600 mb-2">
          Rating: {product.averageRating} ⭐ ({product.review.length} reviews)
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
