import { useLocation, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductsOfStore = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const { store: passedStore } = location.state || {}; // data from Stores.jsx
  const [store, setStore] = useState(passedStore || null);
  const [loading, setLoading] = useState(!passedStore);

  // Fallback fetch if user refreshes or comes directly to this page
  useEffect(() => {
    if (!store) {
      const fetchStore = async () => {
        try {
          const res = await fetch(`/api/stores/${storeId}`);
          const data = await res.json();
          setStore(data);
        } catch (err) {
          console.error("Error fetching store:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStore();
    }
  }, [storeId, store]);

  if (loading) return <div className="p-6">Loading products...</div>;
  if (!store) return <div className="p-6 text-red-600">Store not found</div>;

  return (
    <div className="p-6">
      {/* Store Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        {store.name}
        {store.isVerified && (
          <span className="text-teal-600 text-sm font-medium">✔ Verified</span>
        )}
      </h2>
      <p className="text-gray-600">
        📍 {store.address.street}, {store.address.city}, {store.address.state}
      </p>
      <p className="text-gray-600 mt-1">👤 {store.owner.name}</p>

      {/* Products Grid */}
      <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
        Products
      </h3>
      {store.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              state={{ product }}
              className="bg-white p-4 rounded-lg shadow-2xl hover:shadow-lg transition block hover:scale-101"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-md mb-2"
              />
              <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
              <p className="text-gray-600">{product.brand}</p>
              <p className="text-gray-900 font-semibold mt-2">₹{product.price}</p>
              <p
                className={`mt-1 text-sm ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
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
