import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getNearbyProductsByCategory } from "../../utils/api/product.api";

const Category = () => {
  const { category } = useParams();
  const location = useLocation();
  const userLocation = location.state?.userLocation; // comes from Categories Link

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category || !userLocation?.lat || !userLocation?.lng) return;

      try {
        const data = await getNearbyProductsByCategory(
          userLocation.lat,
          userLocation.lng,
          category
        );
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, userLocation]);

  if (loading)
    return (
      <p className="flex items-center justify-center min-h-screen bg-gray-50">
        LOADING...
      </p>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">{category} Products Nearby</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found nearby in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
                <Link
                    to={`/product/${p._id}`}
                >
                    {/* Product Image */}
                    <img
                        src={p.images?.[0] || "/placeholder.png"}
                        alt={p.name}
                        className="w-full h-40 object-cover mb-3 rounded"
                    />

                    {/* Product Info */}
                    <h2 className="font-semibold text-lg">{p.name}</h2>
                    <p className="text-gray-600">₹{p.price}</p>

                    {/* Store Info */}
                    <p className="text-sm text-gray-500">
                        From <span className="font-medium">{p.store?.name}</span>
                    </p>
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
