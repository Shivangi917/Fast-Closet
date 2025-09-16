import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../utils/api/product.api";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="mb-16 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 border-b border-gray-400 pb-2 inline-block">
          Explore Products
        </h2>
        <Link
          to="/products"
          className="text-gray-600 hover:text-gray-800 font-semibold transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.length > 0 ? (
          products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-gray-700">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
