import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { searchQuery } from "../../utils/api/search.api";

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ products: [], stores: [], categories: [] });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        searchQuery(search).then(setResults);
      } else {
        setResults({ products: [], stores: [], categories: [] });
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <motion.input
        type="text"
        placeholder="Search for products, stores, or categories..."
        className="w-full p-4 rounded-full text-gray-200 bg-neutral-800 
                  border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-400 
                  transition-all shadow-lg pl-6 placeholder-gray-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      />

      {/* Suggestions Dropdown */}
      {search && (
        <div className="absolute top-16 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-501 p-4">
          {/* Products */}
          {results.products.length > 0 && (
            <div className="mb-4">
              <h4 className="text-gray-700 font-semibold mb-2">Products</h4>
              {results.products.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {p.name} - ₹{p.price}
                </Link>
              ))}
            </div>
          )}

          {/* Stores */}
          {results.stores.length > 0 && (
            <div className="mb-4">
              <h4 className="text-gray-700 font-semibold mb-2">Stores</h4>
              {results.stores.map((s) => (
                <Link
                  key={s._id}
                  to={`/products/store/${s._id}`}
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {s.name} {s.isVerified && "✔"}
                </Link>
              ))}
            </div>
          )}

          {/* Categories */}
          {results.categories.length > 0 && (
            <div>
              <h4 className="text-gray-700 font-semibold mb-2">Categories</h4>
              {results.categories.map((c, idx) => (
                <Link
                  key={idx}
                  to={`/category/${c}`}
                  className="block px-2 py-1 text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          {results.products.length === 0 &&
           results.stores.length === 0 &&
           results.categories.length === 0 && (
            <p className="text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
