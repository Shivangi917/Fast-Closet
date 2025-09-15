import { Link } from "react-router-dom";

const Categories = () => {
  const categories = ["Men", "Women", "Kids", "Accessories"];

  return (
    <div className="py-12 px-6">
      <h2 className="font-bold text-3xl border-b border-gray-400 pb-2 inline-block mb-10">
        Explore Categories
      </h2>

      <div className="flex gap-10">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/category/${cat.toLowerCase()}`}
            className="block p-6 text-lg font-semibold text-center
                       bg-gray-100 text-gray-800 rounded-xl shadow-md 
                       hover:shadow-lg hover:scale-105 
                       hover:bg-gray-200 hover:text-gray-600 
                       transition-all duration-300 w-35"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
