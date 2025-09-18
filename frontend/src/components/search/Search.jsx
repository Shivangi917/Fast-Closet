import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { autocompleteQuery, searchQuery } from "../../utils/api/search.api";

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ products: [], stores: [], categories: [] });
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.trim().length > 1) {
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await autocompleteQuery(search);
          setSuggestions(data);
        } catch (err) {
          console.error(err);
          setSuggestions([]);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  // Full search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchQuery(search).then(setResults);
      } else {
        setResults({ products: [], stores: [], categories: [] });
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <motion.input
        type="text"
        placeholder="Search for products, stores, or categories..."
        className="w-full p-4 rounded-full text-gray-100 bg-neutral-900 border border-neutral-700
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md pl-6 placeholder-gray-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", duration: 0.5 }}
      />

      {/* Autocomplete Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-16 w-full bg-neutral-900 text-gray-100 rounded-xl shadow-lg border border-neutral-700 z-50 overflow-hidden">
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              onClick={() => handleSuggestionClick(s.value)}
              className="px-4 py-2 hover:bg-indigo-600 cursor-pointer transition-colors flex justify-between items-center"
            >
              <span className="capitalize">{s.value}</span>
              <span className="text-xs text-indigo-200 font-medium">{s.type}</span>
            </div>
          ))}
        </div>
      )}

      {/* Full Search Results */}
      {search && !suggestions.length && (
        <div className="mt-2 bg-neutral-900 text-gray-100 rounded-xl shadow-lg border border-neutral-700 p-4">
          {results.products.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Products</h4>
              {results.products.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="block px-2 py-1 hover:bg-indigo-600 rounded-md transition"
                >
                  {p.name} - ₹{p.price}
                </Link>
              ))}
            </div>
          )}

          {results.stores.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Stores</h4>
              {results.stores.map((s) => (
                <Link
                  key={s._id}
                  to={`/products/store/${s._id}`}
                  className="block px-2 py-1 hover:bg-indigo-600 rounded-md transition"
                >
                  {s.name} {s.isVerified && "✔"}
                </Link>
              ))}
            </div>
          )}

          {results.categories.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              {results.categories.map((c, idx) => (
                <Link
                  key={idx}
                  to={`/category/${c}`}
                  className="block px-2 py-1 hover:bg-indigo-600 rounded-md transition"
                >
                  {c}
                </Link>
              ))}
            </div>
          )}

          {results.products.length === 0 &&
           results.stores.length === 0 &&
           results.categories.length === 0 && (
            <p className="text-gray-400">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
