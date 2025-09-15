import { Link } from "react-router-dom";

const Stores = ({ stores }) => {
  return (
    <div className="mb-16 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 border-b border-gray-500 pb-2 inline-block">
          Stores Near You
        </h2>
        <Link
          to="/stores"
          className="text-gray-600 hover:text-gray-800 font-semibold transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.length > 0 ? (
          stores.map((store) => (
            <Link
              key={store._id}
              to={`/store/${store._id}`}
              className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200
                         hover:shadow-lg hover:border-teal-500 hover:-translate-y-1 
                         transition-all duration-300 block"
            >
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {store.name}
              </h3>
              <p className="text-gray-500">{store.distance.toFixed(1)} km away</p>
              <p className="text-gray-600 mt-2">
                {store.products.length} products available
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No stores found near you.</p>
        )}
      </div>
    </div>
  );
};

export default Stores;
