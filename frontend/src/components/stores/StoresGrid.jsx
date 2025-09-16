import { Link } from "react-router-dom";

const StoresGrid = ({ stores, hideHeader=false }) => {
  return (
    <div className="mb-16 px-6">
      {!hideHeader && (
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
      )}

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.length > 0 ? (
          stores.map((store) => (
            <Link
              key={store._id}
              to={`/products/store/${store._id}`}
              state={{ store }}
              className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200
                         hover:shadow-lg hover:border-teal-500 hover:-translate-y-1 
                         transition-all duration-300 block"
            >
              {/* Store Name + Verified Badge */}
              <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                {store.name}
                {store.isVerified && (
                  <span className="text-teal-600 text-sm font-medium">✔ Verified</span>
                )}
              </h3>

              {/* Address */}
              <p className="text-gray-600">
                📍 {store.address.street}, {store.address.city}, {store.address.state}
              </p>

              {/* Owner */}
              <p className="text-gray-600 mt-1">👤 {store.owner.name}</p>

              {/* Contact */}
              {store.contactNumber && (
                <p className="text-gray-600 mt-1">📞 {store.contactNumber}</p>
              )}

              {/* Products Count */}
              <p className="text-gray-700 mt-3 font-medium">
                🛒 {store.products.length} products available
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

export default StoresGrid;
