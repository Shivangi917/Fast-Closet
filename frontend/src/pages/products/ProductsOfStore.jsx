import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { fetchProductsByStore } from "../../utils/api/product.api.js";

const ProductsOfStore = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const { store: passedStore } = location.state || {};

  const [store, setStore] = useState(passedStore || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByStore(storeId);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [storeId]);

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        {store?.name || "Store"} – Products
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              state={{ product }}
              className="bg-white p-4 rounded-lg shadow hover:scale-105 transition"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-72 object-cover rounded-md mb-2"
              />
              <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
              <p className="text-gray-600">{product.brand}</p>
              <p className="text-gray-900 font-semibold mt-2">₹{product.price}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products available in this store.</p>
      )}
    </div>
  );
};

export default ProductsOfStore;
