import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LocationContext } from "../../context/LocationContext";
import { fetchProducts } from "../../utils/api/product.api";

const Products = () => {
  const { location } = useContext(LocationContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filters
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchProducts(location.lat, location.lng)
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
        })
        .catch(console.error);
    }
  }, [location]);

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }
    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [category, sort, inStock, products]);

  return (
    <div className="ml-5">
      <h1 className="text-4xl font-bold mb-6 mt-6">Explore Products</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Accessories">Accessories</option>
          <option value="Footwear">Footwear</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => (
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
