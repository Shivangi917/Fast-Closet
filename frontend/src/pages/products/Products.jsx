import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LocationContext } from "../../context/LocationContext";
import { fetchProducts } from "../../utils/api/product.api";

const Products = () => {
  const { location } = useContext(LocationContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchProducts(location.lat, location.lng)
        .then(setProducts)
        .catch(console.error);
    }
  }, [location]);

  return (
    <div className="ml-5">
      <h1 className="text-4xl font-bold mb-6 mt-6">Explore Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.length > 0 ? (
          products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-gray-700">₹{product.price}</p>
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
