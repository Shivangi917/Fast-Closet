import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  // Fetch nearby stores
  useEffect(() => {
    if (location.lat && location.lng) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/stores/nearby`, {
          params: { lat: location.lat, lng: location.lng },
        })
        .then((res) => setStores(res.data))
        .catch((err) => console.error(err));
    }
  }, [location]);

  // Fetch trending products
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/trending`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 px-6 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4">Fresh Looks, Fast Delivery</h1>
        <p className="text-xl mb-8 opacity-90">
          Order from local stores and get your clothes in under an hour.
        </p>
        <div className="relative w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-md pl-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-400 pb-2 inline-block">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {["Men", "Women", "Kids", "Accessories"].map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition transform font-semibold text-gray-700"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Nearby Stores */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-indigo-400 pb-2 inline-block">
              stores Near You
            </h2>
            <Link
              to="/stores"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.length > 0 ? (
              stores.map((store) => (
                <Link
                  key={store._id}
                  to={`/store/${store._id}`}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform"
                >
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{store.name}</h3>
                  <p className="text-gray-500">{store.distance.toFixed(1)} km away</p>
                  <p className="text-gray-600 mt-2">{store.products.length} products available</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No stores found near you.</p>
            )}
          </div>
        </div>

        {/* Trending Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-indigo-400 pb-2 inline-block">
              Trending Products
            </h2>
            <Link
              to="/products"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-lg font-bold text-indigo-600">₹{product.price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No trending products available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
